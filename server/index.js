import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync } from "fs";
import productsRouter from "./routes/products.js";
import cartRouter from "./routes/cart.js";
import ordersRouter from "./routes/orders.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", ordersRouter);
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

const distDir = join(__dirname, "..", "dist");
if (existsSync(distDir)) app.use(express.static(distDir));

app.listen(PORT, () => console.log(`Ecom API server running on http://localhost:${PORT}`));