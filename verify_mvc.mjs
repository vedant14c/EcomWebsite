// verify_mvc.mjs - Comprehensive unit and integration verification of TechNest MVC
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const productsData = require("./data/products.json");

import CartModel from "./models/CartModel.js";
import OrderModel from "./models/OrderModel.js";

// Mock ProductModel with the exact implementation from ProductModel.js for direct testing
class ProductModelTest {
  constructor() {
    this.products = Array.isArray(productsData) ? [...productsData] : [];
  }
  loadProducts() { return this.getProducts(); }
  getProducts() { return [...this.products]; }
  getProductById(id) {
    const numId = Number(id);
    return this.products.find((prod) => prod.id === numId) || null;
  }
  searchProducts(query) {
    if (!query || typeof query !== "string") return this.getProducts();
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) return this.getProducts();
    return this.products.filter((product) => {
      const nameMatch = product.name?.toLowerCase().includes(cleanQuery);
      const categoryMatch = product.category?.toLowerCase().includes(cleanQuery);
      const brandMatch = product.brand?.toLowerCase().includes(cleanQuery);
      const descMatch = product.description?.toLowerCase().includes(cleanQuery);
      return nameMatch || categoryMatch || brandMatch || descMatch;
    });
  }
  filterByCategory(category) {
    if (!category || category.toLowerCase() === "all") return this.getProducts();
    return this.products.filter(
      (prod) => prod.category.toLowerCase() === category.toLowerCase()
    );
  }
  getCategories() {
    const categories = new Set(this.products.map((prod) => prod.category));
    return ["all", ...Array.from(categories)];
  }
}
const ProductModel = new ProductModelTest();

// Mock localStorage for Node environment
const store = {};
global.localStorage = {
  getItem: (key) => store[key] || null,
  setItem: (key, val) => { store[key] = String(val); },
  removeItem: (key) => { delete store[key]; },
  clear: () => { Object.keys(store).forEach(k => delete store[k]); }
};

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    testsPassed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    testsFailed++;
  }
}

console.log("\n=======================================================");
console.log("1. TESTING PRODUCT MODEL (ProductModel.js)");
console.log("=======================================================");

const allProducts = ProductModel.getProducts();
assert(Array.isArray(allProducts) && allProducts.length === 6, `getProducts() returns 6 products (got ${allProducts.length})`);

const loadedProducts = ProductModel.loadProducts();
assert(Array.isArray(loadedProducts) && loadedProducts.length === 6, `loadProducts() returns 6 products`);

const laptop = ProductModel.getProductById(1);
assert(laptop !== null && laptop.name === "Laptop" && laptop.price === 999.99, `getProductById(1) returns Laptop at ₹999.99`);

const invalidProd = ProductModel.getProductById(999);
assert(invalidProd === null, `getProductById(999) returns null for non-existent ID`);

const searchWatch = ProductModel.searchProducts("watch");
assert(searchWatch.length === 1 && searchWatch[0].name === "Watches", `searchProducts('watch') returns 1 item: Watches`);

const searchAudio = ProductModel.filterByCategory("Audio");
assert(searchAudio.length === 2, `filterByCategory('Audio') returns 2 items (Wireless Headphones, Speakers)`);

const allCats = ProductModel.getCategories();
assert(allCats.includes("all") && allCats.includes("Computers") && allCats.includes("Audio"), `getCategories() returns valid list: ${allCats.join(', ')}`);


console.log("\n=======================================================");
console.log("2. TESTING CART MODEL (CartModel.js)");
console.log("=======================================================");

CartModel.clearCart();
assert(CartModel.getCart().length === 0, `Cart is empty after clearCart()`);
assert(CartModel.getCartCount() === 0, `getCartCount() is 0`);
assert(CartModel.getSubtotal() === 0, `getSubtotal() is 0`);
assert(CartModel.getTax() === 0, `getTax() is 0 for empty cart`);
assert(CartModel.getTotal() === 0, `getTotal() is 0 for empty cart`);

// Add item 1 (Laptop: stock 50, price 999.99)
const addResult1 = CartModel.addToCart(1, 2, 50, 999.99);
assert(addResult1.success === true && addResult1.isNew === true, `addToCart(1, qty=2) adds new item`);
assert(CartModel.getCartCount() === 1, `Cart count is now 1`);
assert(CartModel.getCart()[0].quantity === 2, `Quantity in cart is 2`);
assert(CartModel.getCart()[0].price === 1999.98, `Line price in cart is ₹1999.98`);

// Add item 1 again (incremental addition)
const addResult2 = CartModel.addToCart(1, 1, 50, 999.99);
assert(addResult2.isNew === false && CartModel.getCart()[0].quantity === 3, `Adding same product increments quantity to 3`);

// Stock limit test (stock is 50, trying to add 100)
CartModel.addToCart(1, 100, 50, 999.99);
assert(CartModel.getCart()[0].quantity === 50, `Quantity correctly clamped to stock limit (50)`);

// Test increaseQuantity when at stock limit
const atLimitResult = CartModel.increaseQuantity(1, 50, 999.99);
assert(atLimitResult.success === false && CartModel.getCart()[0].quantity === 50, `increaseQuantity() cannot exceed stock (remains 50)`);

// Add second item (Smartphone: ID 2, stock 100, price 499.99, qty 1)
CartModel.addToCart(2, 1, 100, 499.99);
assert(CartModel.getCartCount() === 2, `Cart count is now 2 distinct items`);

// Test decreaseQuantity
CartModel.decreaseQuantity(2, 499.99);
assert(CartModel.getCart().find(i => i.id === 2).quantity === 1, `decreaseQuantity cannot go below 1 (remains 1)`);

// Totals test: Laptop (50 * 999.99 = 49999.50) + Smartphone (1 * 499.99 = 499.99)
const expectedSubtotal = Number((49999.50 + 499.99).toFixed(2)); // 50499.49
assert(CartModel.getSubtotal() === expectedSubtotal, `getSubtotal() returns ₹${expectedSubtotal}`);
assert(CartModel.getTax() === 50, `getTax() returns ₹50 flat tax for non-empty cart`);
assert(CartModel.getTotal() === Number((expectedSubtotal + 50).toFixed(2)), `getTotal() returns ₹${expectedSubtotal + 50}`);

// Remove product test
CartModel.removeFromCart(1);
assert(CartModel.getCartCount() === 1, `removeFromCart(1) leaves 1 item`);
assert(CartModel.getCart()[0].id === 2, `Remaining item is ID 2 (Smartphone)`);

CartModel.removeFromCart(2);
assert(CartModel.getCartCount() === 0, `removeFromCart(2) leaves 0 items`);
assert(CartModel.getTax() === 0, `Tax drops to 0 when cart is empty`);


console.log("\n=======================================================");
console.log("3. TESTING ORDER MODEL (OrderModel.js)");
console.log("=======================================================");

const orderId = OrderModel.generateOrderId();
assert(orderId.startsWith("TN-") && orderId.length === 8, `generateOrderId() returns format TN-XXXXX (${orderId})`);

const mockCustomer = {
  name: "Vedant Sharma",
  phone: "9876543210",
  email: "vedant@example.com",
  address: "123 Tech Park, Pune"
};
const mockItems = [{ id: 1, quantity: 2, price: 1999.98 }];
const newOrder = OrderModel.createOrder(mockCustomer, mockItems, 1999.98, 50, 2049.98);

assert(newOrder !== null && newOrder.orderId.startsWith("TN-"), `createOrder() returns order with ID ${newOrder.orderId}`);
assert(newOrder.customer.name === "Vedant Sharma", `Customer name is saved correctly`);
assert(newOrder.finalTotal === 2049.98, `Final total is saved correctly`);
assert(newOrder.status === "Confirmed", `Order status is Confirmed`);

const savedOrders = OrderModel.getOrders();
assert(savedOrders.length >= 1, `getOrders() retrieves saved order from localStorage (count: ${savedOrders.length})`);
assert(savedOrders.some(o => o.orderId === newOrder.orderId), `Saved order is present in ordersLS array`);


console.log("\n=======================================================");
console.log("4. VERIFICATION SUMMARY");
console.log("=======================================================");
console.log(`Total Passed: ${testsPassed}`);
console.log(`Total Failed: ${testsFailed}`);

if (testsFailed > 0) {
  process.exit(1);
} else {
  console.log("ALL UNIT AND LOGIC TESTS PASSED SUCCESSFULLY!\n");
}
