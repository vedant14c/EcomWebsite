import { Router } from "express";
import { customAlphabet } from "nanoid";
import db from "../db.js";

const router = Router();
const genSuffix = customAlphabet("0123456789", 5);

router.use((req, res, next) => {
  const clientId = req.header("X-Client-Id");
  if (!clientId) return res.status(400).json({ error: "Missing X-Client-Id header" });
  req.clientId = clientId;
  next();
});

router.post("/", (req, res) => {
  const { name, email, phone, address } = req.body;

  const placeOrder = db.transaction(() => {
    const cartRows = db
      .prepare(
        `SELECT ci.product_id, ci.quantity, p.name AS product_name, p.price, p.stock
         FROM cart_items ci JOIN products p ON p.id = ci.product_id
         WHERE ci.client_id = ?`
      )
      .all(req.clientId);

    if (cartRows.length === 0) throw { status: 400, message: "Cart is empty" };

    for (const row of cartRows) {
      if (row.quantity > row.stock) {
        throw { status: 409, message: `Not enough stock for ${row.product_name}` };
      }
    }

    const items = cartRows.map((r) => ({
      id: r.product_id,
      name: r.product_name,
      quantity: r.quantity,
      price: Number((r.price * r.quantity).toFixed(2)),
    }));
    const subtotal = Number(items.reduce((sum, i) => sum + i.price, 0).toFixed(2));
    const tax = subtotal > 0 ? 50 : 0;
    const finalTotal = Number((subtotal + tax).toFixed(2));
    const orderId = `TN-${genSuffix()}`;

    db.prepare(
      `INSERT INTO orders (order_id, client_id, date, customer_name, customer_email,
        customer_phone, customer_address, subtotal, tax, final_total, status, items_json)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Confirmed', ?)`
    ).run(orderId, req.clientId, new Date().toISOString(), name || "", email || "",
      phone || "", address || "", subtotal, tax, finalTotal, JSON.stringify(items));

    const decrementStock = db.prepare("UPDATE products SET stock = stock - ? WHERE id = ?");
    for (const row of cartRows) decrementStock.run(row.quantity, row.product_id);

    db.prepare("DELETE FROM cart_items WHERE client_id = ?").run(req.clientId);

    return { orderId, date: new Date().toISOString(), customer: { name, email, phone, address },
      items, subtotal, tax, finalTotal, status: "Confirmed" };
  });

  try {
    res.status(201).json(placeOrder());
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || "Order failed" });
  }
});

router.get("/", (req, res) => {
  const rows = db.prepare("SELECT * FROM orders WHERE client_id = ? ORDER BY date DESC").all(req.clientId);
  res.json(rows.map((r) => ({
    orderId: r.order_id, date: r.date,
    customer: { name: r.customer_name, email: r.customer_email, phone: r.customer_phone, address: r.customer_address },
    items: JSON.parse(r.items_json), subtotal: r.subtotal, tax: r.tax, finalTotal: r.final_total, status: r.status,
  })));
});

export default router;