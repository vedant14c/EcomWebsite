import CartModel from "../models/CartModel.js";
import ProductModel from "../models/ProductModel.js";
import CartView from "../views/CartView.js";
import SharedView from "../views/SharedView.js";

/**
 * CartController
 * Owns user interaction and event handling for the shopping cart page.
 * Coordinates CartModel, ProductModel, CartView, and SharedView.
 */
class CartController {
  /**
   * Initialize cart page controller
   */
  init() {
    SharedView.updateCartBadge(CartModel.getCartCount());
    this.renderCart();
    this.attachEventListeners();
  }

  /**
   * Enrich raw cart items and ask CartView to render
   */
  renderCart() {
    const rawCart = CartModel.getCart();

    const enrichedCart = rawCart
      .map((item) => {
        const product = ProductModel.getProductById(item.id);
        if (!product) return null;

        return {
          id: item.id,
          quantity: item.quantity,
          price: item.price,
          unitPrice: product.price,
          name: product.name,
          category: product.category,
          image: product.image,
          stock: product.stock,
        };
      })
      .filter(Boolean);

    const subtotal = CartModel.calculateSubtotal();
    const tax = CartModel.calculateTax(subtotal);
    const finalTotal = CartModel.calculateFinalTotal();

    CartView.renderCart(enrichedCart, { subtotal, tax, finalTotal });
  }

  /**
   * Attach Controller-owned event listeners using event delegation on #productCartContainer
   */
  attachEventListeners() {
    const cartContainer = document.querySelector("#productCartContainer");
    if (cartContainer && !cartContainer.dataset.listenerAttached) {
      cartContainer.dataset.listenerAttached = "true";

      cartContainer.addEventListener("click", (event) => {
        // 1. Quantity Increment
        const incBtn = event.target.closest(".cartIncrement");
        if (incBtn) {
          const productId = incBtn.getAttribute("data-id");
          const product = ProductModel.getProductById(productId);
          if (product) {
            CartModel.increaseQuantity(productId, product.stock, product.price);
            this.renderCart();
          }
          return;
        }

        // 2. Quantity Decrement
        const decBtn = event.target.closest(".cartDecrement");
        if (decBtn) {
          const productId = decBtn.getAttribute("data-id");
          const product = ProductModel.getProductById(productId);
          if (product) {
            CartModel.decreaseQuantity(productId, product.price);
            this.renderCart();
          }
          return;
        }

        // 3. Remove Item
        const removeBtn = event.target.closest(".remove-to-cart-button");
        if (removeBtn) {
          const productId = removeBtn.getAttribute("data-id");
          CartModel.removeFromCart(productId);

          // Update UI
          SharedView.updateCartBadge(CartModel.getCartCount());
          SharedView.showToast("delete", productId);

          this.renderCart();
        }
      });
    }
  }
}

export default new CartController();
