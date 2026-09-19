import Database from "better-sqlite3";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFileSync, existsSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, "ecom.db");
const SEED_PATH = join(__dirname, "..", "data", "products.json");

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT,
    brand TEXT,
    price REAL NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    description TEXT,
    image TEXT
  );

  CREATE TABLE IF NOT EXISTS cart_items (
    client_id TEXT NOT NULL,
    product_id INTEGER NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL,
    PRIMARY KEY (client_id, product_id)
  );

  CREATE TABLE IF NOT EXISTS orders (
    order_id TEXT PRIMARY KEY,
    client_id TEXT NOT NULL,
    date TEXT NOT NULL,
    customer_name TEXT,
    customer_email TEXT,
    customer_phone TEXT,
    customer_address TEXT,
    subtotal REAL NOT NULL,
    tax REAL NOT NULL,
    final_total REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'Confirmed',
    items_json TEXT NOT NULL
  );
`);

const productCount = db.prepare("SELECT COUNT(*) AS c FROM products").get().c;
if (productCount === 0 && existsSync(SEED_PATH)) {
  const products = JSON.parse(readFileSync(SEED_PATH, "utf-8"));
  const insert = db.prepare(`
    INSERT INTO products (id, name, category, brand, price, stock, description, image)
    VALUES (@id, @name, @category, @brand, @price, @stock, @description, @image)
  `);
  const insertMany = db.transaction((rows) => rows.forEach((row) => insert.run(row)));
  insertMany(products);
  console.log(`Seeded ${products.length} products into ecom.db`);
}

export default db;
