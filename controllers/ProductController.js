import ProductModel from "../models/ProductModel.js";
import CartModel from "../models/CartModel.js";
import ProductView from "../views/ProductView.js";
import SharedView from "../views/SharedView.js";

/**
 * ProductController
 * Owns user interaction and event handling for the product catalog.
 * Coordinates ProductModel, ProductView, CartModel, and SharedView.
 */
class ProductController {
  constructor() {
    this.currentCategory = "all";
    this.currentSearchQuery = "";
  }

  /**
   * Initialize catalog controller, attach event listeners, and render products
   */
  init() {
    // Sync cart badge
    SharedView.updateCartBadge(CartModel.getCartCount());

    // Render products
    this.renderCatalog();

    // Attach Controller-owned event listeners
    this.attachEventListeners();
  }

  /**
   * Filter and render products
   */
  renderCatalog() {
    let products = ProductModel.getProducts();

    // Apply category filter if set
    if (this.currentCategory && this.currentCategory !== "all") {
      products = ProductModel.filterByCategory(this.currentCategory);
    }

    // Apply search filter if present
    if (this.currentSearchQuery) {
      products = ProductModel.searchProducts(this.currentSearchQuery);
      if (this.currentCategory && this.currentCategory !== "all") {
        products = products.filter(
          (p) => p.category.toLowerCase() === this.currentCategory.toLowerCase()
        );
      }
    }

    ProductView.renderProducts(products);
  }

  /**
   * Attach Controller-owned event listeners (using event delegation)
   */
  attachEventListeners() {
    // 1. Event delegation on #productContainer
    const productContainer = document.querySelector("#productContainer");
    if (productContainer && !productContainer.dataset.listenerAttached) {
      productContainer.dataset.listenerAttached = "true";

      productContainer.addEventListener("click", (event) => {
        // Handle Quantity Toggle (+ / -)
        const incBtn = event.target.closest(".cartIncrement");
        const decBtn = event.target.closest(".cartDecrement");

        if (incBtn || decBtn) {
          const cardElem = event.target.closest(".cards");
          if (!cardElem) return;

          const productId = cardElem.getAttribute("data-id");
          const stock = parseInt(cardElem.getAttribute("data-stock"), 10) || 1;
          const currentQty = ProductView.getCardQuantity(productId);

          if (incBtn) {
            if (currentQty < stock) {
              ProductView.updateCardQuantity(productId, currentQty + 1);
            }
          } else if (decBtn) {
            if (currentQty > 1) {
              ProductView.updateCardQuantity(productId, currentQty - 1);
            }
          }
          return;
        }

        // Handle Add to Cart
        const addBtn = event.target.closest(".add-to-cart-button");
        if (addBtn) {
          const cardElem = event.target.closest(".cards");
          if (!cardElem) return;

          const productId = cardElem.getAttribute("data-id");
          const product = ProductModel.getProductById(productId);
          if (!product) return;

          const selectedQty = ProductView.getCardQuantity(productId);

          // Business logic executed in CartModel
          CartModel.addToCart(productId, selectedQty, product.stock, product.price);

          // Update UI
          SharedView.updateCartBadge(CartModel.getCartCount());
          SharedView.showToast("add", productId);
        }
      });
    }

    // 2. Search input listener
    const searchInput = document.querySelector("#productSearchInput");
    if (searchInput && !searchInput.dataset.listenerAttached) {
      searchInput.dataset.listenerAttached = "true";
      searchInput.addEventListener("input", (e) => {
        this.currentSearchQuery = e.target.value;
        this.renderCatalog();
      });
    }

    // 3. Category filter buttons listener
    const filterContainer = document.querySelector(".category-filters");
    if (filterContainer && !filterContainer.dataset.listenerAttached) {
      filterContainer.dataset.listenerAttached = "true";
      filterContainer.addEventListener("click", (e) => {
        const btn = e.target.closest(".category-filter-btn");
        if (!btn) return;

        const allButtons = filterContainer.querySelectorAll(".category-filter-btn");
        allButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        this.currentCategory = btn.getAttribute("data-category") || "all";
        this.renderCatalog();
      });
    }
  }
}

export default new ProductController();
