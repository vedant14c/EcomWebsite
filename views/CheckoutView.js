/**
 * CheckoutView
 * Responsible ONLY for rendering the demo checkout modal and confirmation screens.
 * Event listeners are attached and handled by OrderController.
 */
class CheckoutView {
  constructor() {
    this.modalOverlay = null;
  }

  /**
   * Ensure modal DOM wrapper exists
   * @returns {HTMLElement}
   */
  ensureModalWrapper() {
    let overlay = document.querySelector("#checkoutModalOverlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "checkoutModalOverlay";
      overlay.style.position = "fixed";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.width = "100vw";
      overlay.style.height = "100vh";
      overlay.style.backgroundColor = "rgba(0, 0, 0, 0.65)";
      overlay.style.display = "none";
      overlay.style.alignItems = "center";
      overlay.style.justifyContent = "center";
      overlay.style.zIndex = "10000";
      document.body.appendChild(overlay);
    }
    this.modalOverlay = overlay;
    return overlay;
  }

  /**
   * Render checkout form with current totals
   * @param {{subtotal: number, tax: number, finalTotal: number}} totals 
   */
  renderCheckoutForm(totals) {
    const overlay = this.ensureModalWrapper();

    overlay.innerHTML = `
      <div class="checkout-modal-card" style="background: #ffffff; border-radius: 1.2rem; max-width: 520px; width: 90%; padding: 2.5rem; position: relative; box-shadow: 0 10px 30px rgba(0,0,0,0.25); max-height: 90vh; overflow-y: auto;">
        <button id="closeCheckoutModalBtn" style="position: absolute; top: 1.5rem; right: 1.5rem; background: none; border: none; font-size: 2.4rem; cursor: pointer; color: #718096;" aria-label="Close">&times;</button>
        
        <h2 style="font-size: 2.2rem; color: #1a202c; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.8rem;">
          <i class="fa-solid fa-bag-shopping" style="color: var(--main-color, #535bf2);"></i>
          Demo Checkout
        </h2>
        <p style="font-size: 1.4rem; color: #718096; margin-bottom: 1.5rem;">Enter your delivery details to complete your demo order.</p>

        <!-- Totals summary box -->
        <div style="background: #f7fafc; border: 1px solid #e2e8f0; border-radius: 0.8rem; padding: 1.2rem 1.5rem; margin-bottom: 1.5rem; font-size: 1.4rem;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.4rem;">
            <span>Subtotal:</span>
            <strong>₹${totals.subtotal}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.4rem;">
            <span>Shipping / Handling:</span>
            <strong>₹${totals.tax}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 1.6rem; font-weight: 700; border-top: 1px dashed #cbd5e0; padding-top: 0.6rem; margin-top: 0.6rem;">
            <span>Total Payable:</span>
            <span style="color: var(--main-color, #535bf2);">₹${totals.finalTotal}</span>
          </div>
        </div>

        <!-- Validation Error Message container -->
        <div id="checkoutErrorMsg" style="display: none; background: #fff5f5; color: #c53030; border: 1px solid #feb2b2; padding: 0.8rem 1.2rem; border-radius: 0.6rem; font-size: 1.3rem; margin-bottom: 1.2rem;"></div>

        <form id="checkoutForm">
          <div style="margin-bottom: 1.2rem;">
            <label for="custName" style="display: block; font-size: 1.4rem; font-weight: 600; color: #2d3748; margin-bottom: 0.4rem;">Full Name *</label>
            <input type="text" id="custName" name="name" placeholder="e.g. Vedant Sharma" required style="width: 100%; padding: 1rem; border: 1px solid #cbd5e0; border-radius: 0.6rem; font-size: 1.4rem; font-family: inherit;" />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.2rem;">
            <div>
              <label for="custPhone" style="display: block; font-size: 1.4rem; font-weight: 600; color: #2d3748; margin-bottom: 0.4rem;">Phone *</label>
              <input type="tel" id="custPhone" name="phone" placeholder="10-digit number" required style="width: 100%; padding: 1rem; border: 1px solid #cbd5e0; border-radius: 0.6rem; font-size: 1.4rem; font-family: inherit;" />
            </div>
            <div>
              <label for="custEmail" style="display: block; font-size: 1.4rem; font-weight: 600; color: #2d3748; margin-bottom: 0.4rem;">Email</label>
              <input type="email" id="custEmail" name="email" placeholder="Optional" style="width: 100%; padding: 1rem; border: 1px solid #cbd5e0; border-radius: 0.6rem; font-size: 1.4rem; font-family: inherit;" />
            </div>
          </div>

          <div style="margin-bottom: 1.5rem;">
            <label for="custAddress" style="display: block; font-size: 1.4rem; font-weight: 600; color: #2d3748; margin-bottom: 0.4rem;">Delivery Address *</label>
            <textarea id="custAddress" name="address" rows="2" placeholder="House/Flat No, Area, City, PIN" required style="width: 100%; padding: 1rem; border: 1px solid #cbd5e0; border-radius: 0.6rem; font-size: 1.4rem; font-family: inherit; resize: vertical;"></textarea>
          </div>

          <div style="display: flex; gap: 1rem; justify-content: flex-end;">
            <button type="button" id="cancelCheckoutBtn" style="padding: 1rem 1.8rem; background: #edf2f7; color: #4a5568; border: none; border-radius: 0.6rem; font-size: 1.4rem; cursor: pointer;">Cancel</button>
            <button type="submit" id="placeOrderBtn" style="padding: 1rem 2.2rem; background: var(--buttonColor, #2a2c30); color: #fff; border: none; border-radius: 0.6rem; font-size: 1.4rem; cursor: pointer; display: flex; align-items: center; gap: 0.6rem;">
              <i class="fa-solid fa-lock"></i> Place Order (₹${totals.finalTotal})
            </button>
          </div>
        </form>
      </div>
    `;

    overlay.style.display = "flex";
  }

  /**
   * Display validation error message in the checkout form
   * @param {string} message 
   */
  showValidationError(message) {
    const errorMsg = document.querySelector("#checkoutErrorMsg");
    if (errorMsg) {
      errorMsg.textContent = message;
      errorMsg.style.display = "block";
    }
  }

  /**
   * Render order confirmation card
   * @param {Object} order 
   */
  renderOrderConfirmation(order) {
    const overlay = this.ensureModalWrapper();

    overlay.innerHTML = `
      <div class="checkout-modal-card" style="background: #ffffff; border-radius: 1.2rem; max-width: 480px; width: 90%; padding: 2.5rem; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.25);">
        <div style="width: 65px; height: 65px; border-radius: 50%; background: #e6fffa; color: #38b2ac; display: flex; align-items: center; justify-content: center; font-size: 3rem; margin: 0 auto 1.2rem;">
          <i class="fa-solid fa-check"></i>
        </div>

        <h2 style="font-size: 2.4rem; color: #1a202c; margin-bottom: 0.4rem;">Order Placed!</h2>
        <p style="font-size: 1.4rem; color: #718096; margin-bottom: 1.5rem;">Thank you, <strong>${order.customer.name}</strong>!</p>

        <div style="background: #f7fafc; border: 1px solid #e2e8f0; border-radius: 0.8rem; padding: 1.2rem; text-align: left; margin-bottom: 1.5rem; font-size: 1.4rem;">
          <p style="margin-bottom: 0.4rem;"><strong>Order ID:</strong> <span style="color: var(--main-color, #535bf2); font-weight: 700;">${order.orderId}</span></p>
          <p style="margin-bottom: 0.4rem;"><strong>Total Amount:</strong> ₹${order.finalTotal}</p>
          <p style="margin-bottom: 0.4rem;"><strong>Deliver to:</strong> ${order.customer.address}</p>
          <p style="color: #718096; font-size: 1.2rem; margin-top: 0.6rem; border-top: 1px solid #e2e8f0; padding-top: 0.4rem;">
            Estimated delivery within 2-4 business days.
          </p>
        </div>

        <button id="orderContinueShoppingBtn" class="btn" style="padding: 1rem 2.4rem; background: var(--buttonColor, #2a2c30); color: #fff; border: none; border-radius: 0.6rem; font-size: 1.5rem; cursor: pointer; display: inline-flex; align-items: center; gap: 0.8rem;">
          <i class="fa-solid fa-store"></i> Continue Shopping
        </button>
      </div>
    `;

    overlay.style.display = "flex";
  }

  /**
   * Hide the modal
   */
  hideModal() {
    if (this.modalOverlay) {
      this.modalOverlay.style.display = "none";
    }
  }

  /**
   * Show checkout modal (alias)
   * @param {Object} totals 
   */
  showCheckoutModal(totals) {
    this.renderCheckoutForm(totals);
  }

  /**
   * Hide checkout modal (alias)
   */
  hideCheckoutModal() {
    this.hideModal();
  }

  /**
   * Read and sanitize form data
   * @returns {Object}
   */
  getFormData() {
    const form = document.querySelector("#checkoutForm");
    if (!form) return {};
    return {
      name: form.custName ? form.custName.value.trim() : "",
      phone: form.custPhone ? form.custPhone.value.trim() : "",
      email: form.custEmail ? form.custEmail.value.trim() : "",
      address: form.custAddress ? form.custAddress.value.trim() : "",
    };
  }

  /**
   * Show order confirmation (alias)
   * @param {Object} order 
   */
  showOrderConfirmation(order) {
    this.renderOrderConfirmation(order);
  }
}

export default new CheckoutView();
