import { Router } from "express";
import db from "../db.js";

const router = Router();

router.use((req, res, next) => {
  const clientId = req.header("X-Client-Id");
  if (!clientId) return res.status(400).json({ error: "Missing X-Client-Id header" });
  req.clientId = clientId;
  next();
});

function getCartWithDetails(clientId) {
  const rows = db
    .prepare(
      `SELECT ci.product_id AS id, ci.quantity, p.name, p.price, p.stock, p.image, p.category, p.brand
       FROM cart_items ci
       JOIN products p ON p.id = ci.product_id
       WHERE ci.client_id = ?`
    )
    .all(clientId);

  return rows.map((r) => ({
    ...r,
    price: Number((r.price * r.quantity).toFixed(2)),
    unitPrice: r.price,
  }));
}

router.get("/", (req, res) => res.json(getCartWithDetails(req.clientId)));

router.post("/", (req, res) => {
  const productId = Number(req.body.productId);
  const requestedQty = Math.max(1, Number(req.body.quantity) || 1);

  const product = db.prepare("SELECT * FROM products WHERE id = ?").get(productId);
  if (!product) return res.status(404).json({ error: "Product not found" });

  const existing = db
    .prepare("SELECT * FROM cart_items WHERE client_id = ? AND product_id = ?")
    .get(req.clientId, productId);

  const newQty = Math.min((existing?.quantity || 0) + requestedQty, product.stock);

  db.prepare(
    `INSERT INTO cart_items (client_id, product_id, quantity)
     VALUES (?, ?, ?)
     ON CONFLICT(client_id, product_id) DO UPDATE SET quantity = excluded.quantity`
  ).run(req.clientId, productId, newQty);

  res.json(getCartWithDetails(req.clientId));
});

router.patch("/:productId", (req, res) => {
  const productId = Number(req.params.productId);
  const delta = Number(req.body.delta) || 0;

  const product = db.prepare("SELECT * FROM products WHERE id = ?").get(productId);
  const existing = db
    .prepare("SELECT * FROM cart_items WHERE client_id = ? AND product_id = ?")
    .get(req.clientId, productId);

  if (!product || !existing) return res.status(404).json({ error: "Item not in cart" });

  const newQty = Math.min(Math.max(1, existing.quantity + delta), product.stock);
  db.prepare("UPDATE cart_items SET quantity = ? WHERE client_id = ? AND product_id = ?").run(
    newQty, req.clientId, productId
  );

  res.json(getCartWithDetails(req.clientId));
});

router.delete("/:productId", (req, res) => {
  db.prepare("DELETE FROM cart_items WHERE client_id = ? AND product_id = ?").run(
    req.clientId, Number(req.params.productId)
  );
  res.json(getCartWithDetails(req.clientId));
});

router.delete("/", (req, res) => {
  db.prepare("DELETE FROM cart_items WHERE client_id = ?").run(req.clientId);
  res.json([]);
});

export default router;