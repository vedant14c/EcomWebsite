/**
 * CartModel
 * Manages shopping cart state, business logic, stock validation, and localStorage persistence.
 * Strictly decoupled from the DOM.
 */
class CartModel {
  constructor() {
    this.storageKey = "cartProductLS";
  }

  /**
   * Retrieve cart items from localStorage
   * @returns {Array<{id: number, quantity: number, price: number}>}
   */
  getCart() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("CartModel: Error reading cart from localStorage", error);
      return [];
    }
  }

  /**
   * Persist cart items to localStorage
   * @param {Array} cart 
   */
  saveCart(cart) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(cart));
    } catch (error) {
      console.error("CartModel: Error saving cart to localStorage", error);
    }
  }

  /**
   * Add a product to the cart, clamping to available stock
   * @param {number|string} productId 
   * @param {number} quantity 
   * @param {number} stock 
   * @param {number} unitPrice 
   * @returns {{success: boolean, isNew: boolean, item: Object, cart: Array}}
   */
  addToCart(productId, quantity, stock, unitPrice) {
    const id = Number(productId);
    const validQty = Math.max(1, Math.min(Number(quantity) || 1, stock));
    const price = Number(unitPrice) || 0;

    const cart = this.getCart();
    const existingIndex = cart.findIndex((item) => item.id === id);

    let isNew = false;
    let item = null;

    if (existingIndex > -1) {
      // Existing item: increase quantity up to stock limit
      const currentQty = Number(cart[existingIndex].quantity) || 1;
      const updatedQty = Math.min(currentQty + validQty, stock);
      const updatedPrice = Number((updatedQty * price).toFixed(2));

      cart[existingIndex] = {
        ...cart[existingIndex],
        quantity: updatedQty,
        price: updatedPrice,
      };
      item = cart[existingIndex];
      isNew = false;
    } else {
      // New item
      const linePrice = Number((validQty * price).toFixed(2));
      item = {
        id,
        quantity: validQty,
        price: linePrice,
      };
      cart.push(item);
      isNew = true;
    }

    this.saveCart(cart);
    return { success: true, isNew, item, cart };
  }

  /**
   * Increase item quantity by 1, enforcing stock limits
   * @param {number|string} productId 
   * @param {number} stock 
   * @param {number} unitPrice 
   * @returns {{success: boolean, item: Object|null, cart: Array}}
   */
  increaseQuantity(productId, stock, unitPrice) {
    const id = Number(productId);
    const cart = this.getCart();
    const index = cart.findIndex((item) => item.id === id);

    if (index === -1) {
      return { success: false, item: null, cart };
    }

    const currentQty = Number(cart[index].quantity) || 1;
    if (currentQty < stock) {
      const newQty = currentQty + 1;
      const newPrice = Number((newQty * unitPrice).toFixed(2));
      cart[index] = {
        ...cart[index],
        quantity: newQty,
        price: newPrice,
      };
      this.saveCart(cart);
      return { success: true, item: cart[index], cart };
    }

    return { success: false, item: cart[index], cart };
  }

  /**
   * Decrease item quantity by 1, enforcing minimum of 1
   * @param {number|string} productId 
   * @param {number} unitPrice 
   * @returns {{success: boolean, item: Object|null, cart: Array}}
   */
  decreaseQuantity(productId, unitPrice) {
    const id = Number(productId);
    const cart = this.getCart();
    const index = cart.findIndex((item) => item.id === id);

    if (index === -1) {
      return { success: false, item: null, cart };
    }

    const currentQty = Number(cart[index].quantity) || 1;
    if (currentQty > 1) {
      const newQty = currentQty - 1;
      const newPrice = Number((newQty * unitPrice).toFixed(2));
      cart[index] = {
        ...cart[index],
        quantity: newQty,
        price: newPrice,
      };
      this.saveCart(cart);
      return { success: true, item: cart[index], cart };
    }

    return { success: false, item: cart[index], cart };
  }

  /**
   * Remove item from cart
   * @param {number|string} productId 
   * @returns {Array} Updated cart
   */
  removeFromCart(productId) {
    const id = Number(productId);
    const cart = this.getCart().filter((item) => item.id !== id);
    this.saveCart(cart);
    return cart;
  }

  /**
   * Calculate subtotal sum of all items in cart
   * @returns {number}
   */
  calculateSubtotal() {
    const cart = this.getCart();
    const subtotal = cart.reduce((accum, item) => {
      return accum + (Number(item.price) || 0);
    }, 0);
    return Number(subtotal.toFixed(2));
  }

  /**
   * Calculate flat tax/shipping charge (₹50 if cart is non-empty)
   * @param {number} subtotal 
   * @returns {number}
   */
  calculateTax(subtotal) {
    return subtotal > 0 ? 50 : 0;
  }

  /**
   * Calculate final total (subtotal + tax)
   * @returns {number}
   */
  calculateFinalTotal() {
    const subtotal = this.calculateSubtotal();
    const tax = this.calculateTax(subtotal);
    return Number((subtotal + tax).toFixed(2));
  }

  /**
   * Get subtotal of cart items (alias)
   * @returns {number}
   */
  getSubtotal() {
    return this.calculateSubtotal();
  }

  /**
   * Get tax/shipping charge (alias)
   * @returns {number}
   */
  getTax() {
    return this.calculateTax(this.calculateSubtotal());
  }

  /**
   * Get grand total (alias)
   * @returns {number}
   */
  getTotal() {
    return this.calculateFinalTotal();
  }

  /**
   * Get distinct item count in cart
   * @returns {number}
   */
  getCartCount() {
    return this.getCart().length;
  }

  /**
   * Clear all items from cart
   */
  clearCart() {
    this.saveCart([]);
  }
}

export default new CartModel();
