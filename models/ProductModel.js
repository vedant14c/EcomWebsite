import api from "../utils/apiClient.js";

class ProductModel {
  constructor() { this.products = []; }

  async init() {
    this.products = await api.get("/products");
    return this.products;
  }

  async refresh() { return this.init(); }
  loadProducts() { return this.getProducts(); }
  getProducts() { return [...this.products]; }

  getProductById(id) {
    const numId = Number(id);
    return this.products.find((p) => p.id === numId) || null;
  }

  searchProducts(query) {
    const term = (query || "").trim().toLowerCase();
    if (!term) return this.getProducts();
    return this.products.filter((p) =>
      p.name.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term) ||
      p.brand.toLowerCase().includes(term) ||
      (p.description || "").toLowerCase().includes(term)
    );
  }

  filterByCategory(category) {
    if (!category || category === "all") return this.getProducts();
    return this.products.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }

  getCategories() { return [...new Set(this.products.map((p) => p.category))]; }
}

export default new ProductModel();
