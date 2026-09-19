import { Router } from "express";
import db from "../db.js";

const router = Router();

router.get("/", (req, res) => {
  const { search, category } = req.query;
  let sql = "SELECT * FROM products WHERE 1=1";
  const params = [];

  if (category) {
    sql += " AND category = ?";
    params.push(category);
  }
  if (search) {
    sql += " AND (name LIKE ? OR brand LIKE ? OR description LIKE ?)";
    const term = `%${search}%`;
    params.push(term, term, term);
  }

  res.json(db.prepare(sql).all(...params));
});

router.get("/:id", (req, res) => {
  const product = db.prepare("SELECT * FROM products WHERE id = ?").get(Number(req.params.id));
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
});

export default router;