import ProductModel from "../models/ProductModel.js";
import CartModel from "../models/CartModel.js";
import ProductView from "../views/ProductView.js";
import SharedView from "../views/SharedView.js";

class ProductController {
  constructor() {
    this.currentCategory = "all";
    this.currentSearchQuery = "";
  }

  init() {
    SharedView.updateCartBadge(CartModel.getCartCount());
    this.renderCatalog();
    this.attachEventListeners();
  }

  renderCatalog() {
    let products = ProductModel.getProducts();

    if (this.currentCategory && this.currentCategory !== "all") {
      products = ProductModel.filterByCategory(this.currentCategory);
    }

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

  attachEventListeners() {
    const productContainer = document.querySelector("#productContainer");
    if (productContainer && !productContainer.dataset.listenerAttached) {
      productContainer.dataset.listenerAttached = "true";

      productContainer.addEventListener("click", async (event) => {
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

        const addBtn = event.target.closest(".add-to-cart-button");
        if (addBtn) {
          const cardElem = event.target.closest(".cards");
          if (!cardElem) return;

          const productId = cardElem.getAttribute("data-id");
          const product = ProductModel.getProductById(productId);
          if (!product) return;

          const selectedQty = ProductView.getCardQuantity(productId);

          await CartModel.addToCart(productId, selectedQty);

          SharedView.updateCartBadge(CartModel.getCartCount());
          SharedView.showToast("add", productId);
        }
      });
    }

    const searchInput = document.querySelector("#productSearchInput");
    if (searchInput && !searchInput.dataset.listenerAttached) {
      searchInput.dataset.listenerAttached = "true";
      searchInput.addEventListener("input", (e) => {
        this.currentSearchQuery = e.target.value;
        this.renderCatalog();
      });
    }

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
