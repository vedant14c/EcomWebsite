import CartModel from "../models/CartModel.js";
import CartView from "../views/CartView.js";
import SharedView from "../views/SharedView.js";

class CartController {
  init() {
    SharedView.updateCartBadge(CartModel.getCartCount());
    this.renderCart();
    this.attachEventListeners();
  }

  renderCart() {
    const cart = CartModel.getCart();
    const subtotal = CartModel.calculateSubtotal();
    const tax = CartModel.calculateTax(subtotal);
    const finalTotal = CartModel.calculateFinalTotal();
    CartView.renderCart(cart, { subtotal, tax, finalTotal });
  }

  attachEventListeners() {
    const cartContainer = document.querySelector("#productCartContainer");
    if (cartContainer && !cartContainer.dataset.listenerAttached) {
      cartContainer.dataset.listenerAttached = "true";

      cartContainer.addEventListener("click", async (event) => {
        const incBtn = event.target.closest(".cartIncrement");
        if (incBtn) {
          await CartModel.increaseQuantity(incBtn.getAttribute("data-id"));
          SharedView.updateCartBadge(CartModel.getCartCount());
          this.renderCart();
          return;
        }
        const decBtn = event.target.closest(".cartDecrement");
        if (decBtn) {
          await CartModel.decreaseQuantity(decBtn.getAttribute("data-id"));
          SharedView.updateCartBadge(CartModel.getCartCount());
          this.renderCart();
          return;
        }
        const removeBtn = event.target.closest(".remove-to-cart-button");
        if (removeBtn) {
          const productId = removeBtn.getAttribute("data-id");
          await CartModel.removeFromCart(productId);
          SharedView.updateCartBadge(CartModel.getCartCount());
          SharedView.showToast("delete", productId);
          this.renderCart();
        }
      });
    }
  }
}

export default new CartController();
