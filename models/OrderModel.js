/**
 * OrderModel
 * Manages order creation and localStorage persistence (ordersLS).
 * Strictly decoupled from the DOM.
 */
class OrderModel {
  constructor() {
    this.storageKey = "ordersLS";
  }

  /**
   * Retrieve all saved orders from localStorage
   * @returns {Array<Object>}
   */
  getOrders() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("OrderModel: Error reading orders from localStorage", error);
      return [];
    }
  }

  /**
   * Persist orders list to localStorage
   * @param {Array} orders 
   */
  saveOrders(orders) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(orders));
    } catch (error) {
      console.error("OrderModel: Error saving orders to localStorage", error);
    }
  }

  /**
   * Append and save a single order
   * @param {Object} order 
   */
  saveOrder(order) {
    const orders = this.getOrders();
    orders.push(order);
    this.saveOrders(orders);
    return order;
  }

  /**
   * Generate simple unique order ID (e.g. TN-58219)
   * @returns {string}
   */
  generateOrderId() {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    return `TN-${randomSuffix}`;
  }

  /**
   * Create and persist a new order
   * @param {Object} customerDetails 
   * @param {Array} cartItems 
   * @param {number} subtotal 
   * @param {number} tax 
   * @param {number} finalTotal 
   * @returns {Object}
   */
  createOrder(customerDetails, cartItems, subtotal, tax, finalTotal) {
    const orderId = this.generateOrderId();
    const order = {
      orderId,
      date: new Date().toISOString(),
      customer: {
        name: customerDetails.name || "",
        email: customerDetails.email || "",
        phone: customerDetails.phone || "",
        address: customerDetails.address || "",
      },
      items: Array.isArray(cartItems) ? [...cartItems] : [],
      subtotal: Number(subtotal) || 0,
      tax: Number(tax) || 0,
      finalTotal: Number(finalTotal) || 0,
      status: "Confirmed",
    };

    const orders = this.getOrders();
    orders.push(order);
    this.saveOrders(orders);

    return order;
  }
}

export default new OrderModel();
