import api from "../utils/apiClient.js";

class OrderModel {
  async createOrder(customerDetails) { return api.post("/orders", customerDetails); }
  async getOrders() { return api.get("/orders"); }
}

export default new OrderModel();
