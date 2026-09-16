import productsData from "../data/products.json";

/**
 * ProductModel
 * Manages product data, catalog queries, search, and category filtering.
 * Strictly decoupled from the DOM.
 */
class ProductModel {
  constructor() {
    this.products = Array.isArray(productsData) ? [...productsData] : [];
  }

  /**
   * Load and return all products
   * @returns {Array<Object>}
   */
  loadProducts() {
    return this.getProducts();
  }

  /**
   * Return full product collection
   * @returns {Array<Object>}
   */
  getProducts() {
    return [...this.products];
  }

  /**
   * Find product by numerical ID
   * @param {number|string} id 
   * @returns {Object|null}
   */
  getProductById(id) {
    const numId = Number(id);
    return this.products.find((prod) => prod.id === numId) || null;
  }

  /**
   * Search products across name, category, brand, and description
   * @param {string} query 
   * @returns {Array<Object>}
   */
  searchProducts(query) {
    if (!query || typeof query !== "string") {
      return this.getProducts();
    }
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) {
      return this.getProducts();
    }

    return this.products.filter((product) => {
      const nameMatch = product.name?.toLowerCase().includes(cleanQuery);
      const categoryMatch = product.category?.toLowerCase().includes(cleanQuery);
      const brandMatch = product.brand?.toLowerCase().includes(cleanQuery);
      const descMatch = product.description?.toLowerCase().includes(cleanQuery);
      return nameMatch || categoryMatch || brandMatch || descMatch;
    });
  }

  /**
   * Filter products by specific category
   * @param {string} category 
   * @returns {Array<Object>}
   */
  filterByCategory(category) {
    if (!category || category.toLowerCase() === "all") {
      return this.getProducts();
    }
    return this.products.filter(
      (prod) => prod.category.toLowerCase() === category.toLowerCase()
    );
  }

  /**
   * Query unique category list
   * @returns {Array<string>}
   */
  getCategories() {
    const categories = new Set(this.products.map((prod) => prod.category));
    return ["all", ...Array.from(categories)];
  }
}

export default new ProductModel();
