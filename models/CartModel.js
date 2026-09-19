import api from "../utils/apiClient.js";

class CartModel {
  constructor() { this.cart = []; }

  async init() { this.cart = await api.get("/cart"); return this.cart; }
  getCart() { return [...this.cart]; }

  async addToCart(productId, quantity) {
    this.cart = await api.post("/cart", { productId: Number(productId), quantity });
    return { success: true, item: this.cart.find((i) => i.id === Number(productId)) || null, cart: this.cart };
  }

  async increaseQuantity(productId) {
    this.cart = await api.patch(`/cart/${Number(productId)}`, { delta: 1 });
    return { success: true, item: this.cart.find((i) => i.id === Number(productId)) || null, cart: this.cart };
  }

  async decreaseQuantity(productId) {
    this.cart = await api.patch(`/cart/${Number(productId)}`, { delta: -1 });
    return { success: true, item: this.cart.find((i) => i.id === Number(productId)) || null, cart: this.cart };
  }

  async removeFromCart(productId) { this.cart = await api.del(`/cart/${Number(productId)}`); return this.cart; }
  async clearCart() { this.cart = await api.del("/cart"); return this.cart; }

  calculateSubtotal() { return Number(this.cart.reduce((s, i) => s + (Number(i.price) || 0), 0).toFixed(2)); }
  calculateTax(subtotal) { return subtotal > 0 ? 50 : 0; }
  calculateFinalTotal() { const s = this.calculateSubtotal(); return Number((s + this.calculateTax(s)).toFixed(2)); }
  getSubtotal() { return this.calculateSubtotal(); }
  getTax() { return this.calculateTax(this.calculateSubtotal()); }
  getTotal() { return this.calculateFinalTotal(); }
  getCartCount() { return this.cart.length; }
}

export default new CartModel();
