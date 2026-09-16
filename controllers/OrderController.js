import OrderModel from "../models/OrderModel.js";
import CartModel from "../models/CartModel.js";
import CheckoutView from "../views/CheckoutView.js";
import SharedView from "../views/SharedView.js";
import CartController from "./CartController.js";

/**
 * OrderController
 * Owns user interaction and event handling for the checkout flow and order confirmation.
 */
class OrderController {
  /**
   * Initialize checkout button listener
   */
  init() {
    const checkoutBtn = document.querySelector("#proceedCheckoutBtn");
    if (checkoutBtn && !checkoutBtn.dataset.listenerAttached) {
      checkoutBtn.dataset.listenerAttached = "true";
      checkoutBtn.addEventListener("click", () => this.handleOpenCheckout());
    }
  }

  /**
   * Handle checkout initiation
   */
  handleOpenCheckout() {
    const cart = CartModel.getCart();
    if (!cart || cart.length === 0) {
      SharedView.showToast("info", null, "Your cart is empty! Add products before checking out.");
      return;
    }

    const subtotal = CartModel.calculateSubtotal();
    const tax = CartModel.calculateTax(subtotal);
    const finalTotal = CartModel.calculateFinalTotal();

    CheckoutView.renderCheckoutForm({ subtotal, tax, finalTotal });

    // Attach Controller-owned event listeners to the modal form and close buttons
    this.attachModalListeners();
  }

  /**
   * Attach Controller-owned event listeners inside checkout modal
   */
  attachModalListeners() {
    const overlay = document.querySelector("#checkoutModalOverlay");
    if (!overlay) return;

    // Close handlers
    const closeBtn = overlay.querySelector("#closeCheckoutModalBtn");
    const cancelBtn = overlay.querySelector("#cancelCheckoutBtn");
    const handleClose = () => CheckoutView.hideModal();

    if (closeBtn) closeBtn.onclick = handleClose;
    if (cancelBtn) cancelBtn.onclick = handleClose;

    // Form submission
    const form = overlay.querySelector("#checkoutForm");
    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        const formData = {
          name: form.custName ? form.custName.value.trim() : "",
          phone: form.custPhone ? form.custPhone.value.trim() : "",
          email: form.custEmail ? form.custEmail.value.trim() : "",
          address: form.custAddress ? form.custAddress.value.trim() : "",
        };
        this.processOrder(formData);
      };
    }
  }

  /**
   * Validate and process demo order
   * @param {Object} formData 
   */
  processOrder(formData) {
    if (!formData.name || formData.name.length < 2) {
      CheckoutView.showValidationError("Please enter a valid full name.");
      return;
    }

    const phoneDigits = formData.phone.replace(/\D/g, "");
    if (phoneDigits.length < 8) {
      CheckoutView.showValidationError("Please enter a valid phone number (at least 8 digits).");
      return;
    }

    if (!formData.address || formData.address.length < 5) {
      CheckoutView.showValidationError("Please enter your delivery address.");
      return;
    }

    const cartItems = CartModel.getCart();
    const subtotal = CartModel.calculateSubtotal();
    const tax = CartModel.calculateTax(subtotal);
    const finalTotal = CartModel.calculateFinalTotal();

    // Persist order in Model
    const order = OrderModel.createOrder(
      formData,
      cartItems,
      subtotal,
      tax,
      finalTotal
    );

    // Clear cart in Model & update UI
    CartModel.clearCart();
    SharedView.updateCartBadge(0);
    CartController.renderCart();

    // Render Confirmation screen
    CheckoutView.renderOrderConfirmation(order);

    // Attach continue shopping listener
    const continueBtn = document.querySelector("#orderContinueShoppingBtn");
    if (continueBtn) {
      continueBtn.onclick = () => {
        CheckoutView.hideModal();
        window.location.href = "products.html";
      };
    }

    SharedView.showToast("order", order.orderId);
  }
}

export default new OrderController();
