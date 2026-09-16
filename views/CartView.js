/**
 * CartView
 * Responsible ONLY for rendering shopping cart items, line totals, and order summary DOM.
 * Does NOT attach event listeners or contain business logic.
 */
class CartView {
  constructor() {
    this.cartContainer = null;
    this.cartTemplate = null;
    this.subTotalElem = null;
    this.taxElem = null;
    this.finalTotalElem = null;
  }

  /**
   * Bind cart DOM elements
   * @returns {boolean}
   */
  initElements() {
    this.cartContainer = document.querySelector("#productCartContainer");
    this.cartTemplate = document.querySelector("#productCartTemplate");
    this.subTotalElem = document.querySelector(".productSubTotal");
    this.taxElem = document.querySelector(".productTax");
    this.finalTotalElem = document.querySelector(".productFinalTotal");

    return Boolean(this.cartContainer && this.cartTemplate);
  }

  /**
   * Render cart items list and totals
   * @param {Array<Object>} enrichedCartItems 
   * @param {{subtotal: number, tax: number, finalTotal: number}} totals 
   */
  renderCart(enrichedCartItems, totals) {
    if (!this.initElements()) {
      return;
    }

    this.cartContainer.innerHTML = "";
    this.updateTotals(totals);

    if (!enrichedCartItems || enrichedCartItems.length === 0) {
      this.renderEmptyCart();
      return;
    }

    // Ensure checkout button is visible if cart has items
    const checkoutBtn = document.querySelector("#proceedCheckoutBtn");
    if (checkoutBtn) {
      checkoutBtn.style.display = "flex";
    }

    enrichedCartItems.forEach((item) => {
      const { id, name, category, image, quantity, price } = item;
      const productClone = document.importNode(this.cartTemplate.content, true);

      const cardValueElem = productClone.querySelector("#cardValue");
      if (cardValueElem) {
        cardValueElem.setAttribute("id", `card${id}`);
        cardValueElem.setAttribute("data-id", String(id));
      }

      const catElem = productClone.querySelector(".category");
      if (catElem) catElem.textContent = category;

      const nameElem = productClone.querySelector(".productName");
      if (nameElem) nameElem.textContent = name;

      const imgElem = productClone.querySelector(".productImage");
      if (imgElem) {
        imgElem.src = image;
        imgElem.alt = name;
      }

      const qtyElem = productClone.querySelector(".productQuantity");
      if (qtyElem) {
        qtyElem.textContent = String(quantity);
        qtyElem.setAttribute("data-quantity", String(quantity));
      }

      const priceElem = productClone.querySelector(".productPrice");
      if (priceElem) {
        priceElem.textContent = `₹${price}`;
      }

      // Add data-id attributes for Controller event delegation
      const incBtn = productClone.querySelector(".cartIncrement");
      if (incBtn) incBtn.setAttribute("data-id", String(id));

      const decBtn = productClone.querySelector(".cartDecrement");
      if (decBtn) decBtn.setAttribute("data-id", String(id));

      const removeBtn = productClone.querySelector(".remove-to-cart-button");
      if (removeBtn) removeBtn.setAttribute("data-id", String(id));

      this.cartContainer.appendChild(productClone);
    });
  }

  /**
   * Update summary values
   * @param {{subtotal: number, tax: number, finalTotal: number}} totals 
   */
  updateTotals({ subtotal = 0, tax = 0, finalTotal = 0 } = {}) {
    if (this.subTotalElem) {
      this.subTotalElem.textContent = `₹${subtotal}`;
    }
    if (this.taxElem) {
      this.taxElem.textContent = `₹${tax}`;
    }
    if (this.finalTotalElem) {
      this.finalTotalElem.textContent = `₹${finalTotal}`;
    }
  }

  /**
   * Update summary values directly (positional arguments)
   * @param {number} subtotal 
   * @param {number} tax 
   * @param {number} total 
   */
  updateSummary(subtotal = 0, tax = 0, total = 0) {
    this.updateTotals({ subtotal, tax, finalTotal: total });
  }

  /**
   * Display empty cart state
   */
  renderEmptyCart() {
    if (!this.cartContainer) return;

    this.cartContainer.innerHTML = `
      <div class="empty-cart-card" style="text-align: center; padding: 4rem 2rem; background: #ffffff; border-radius: 1rem; box-shadow: 0 4px 12px rgba(0,0,0,0.05); margin-bottom: 2rem;">
        <i class="fa-solid fa-cart-arrow-down" style="font-size: 5rem; color: #a0aec0; margin-bottom: 1.5rem;"></i>
        <h3 style="font-size: 2.2rem; color: var(--textColor, #2d3748); margin-bottom: 0.8rem;">Your Cart is Empty</h3>
        <p style="font-size: 1.6rem; color: #718096; margin-bottom: 2rem;">Looks like you haven't added any gadgets to your cart yet.</p>
        <a href="products.html" class="btn" style="display: inline-block; padding: 1rem 2.4rem; border-radius: 0.5rem; background: var(--buttonColor, #2a2c30); color: #fff; font-size: 1.6rem; text-decoration: none;">
          <i class="fa-solid fa-store" style="margin-right: 0.8rem;"></i>Explore Products
        </a>
      </div>
    `;

    // Hide checkout button when cart is empty
    const checkoutBtn = document.querySelector("#proceedCheckoutBtn");
    if (checkoutBtn) {
      checkoutBtn.style.display = "none";
    }
  }
}

export default new CartView();
