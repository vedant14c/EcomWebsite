/**
 * ProductView
 * Responsible ONLY for rendering product UI into the DOM.
 * Does NOT attach event listeners or contain business logic.
 */
class ProductView {
  constructor() {
    this.container = null;
    this.template = null;
  }

  /**
   * Bind container and template DOM elements
   * @returns {boolean} True if elements exist on current page
   */
  initElements() {
    this.container = document.querySelector("#productContainer");
    this.template = document.querySelector("#productTemplate");
    return Boolean(this.container && this.template);
  }

  /**
   * Render product cards into the container
   * @param {Array<Object>} products 
   */
  renderProducts(products) {
    if (!this.initElements()) {
      return;
    }

    this.container.innerHTML = "";

    if (!products || products.length === 0) {
      this.renderEmptyState("No products found matching your selection.");
      return;
    }

    products.forEach((prod) => {
      const { brand, category, description, id, image, name, price, stock } = prod;
      const productClone = document.importNode(this.template.content, true);

      // Card ID & data attributes
      const cardValueElem = productClone.querySelector("#cardValue");
      if (cardValueElem) {
        cardValueElem.setAttribute("id", `card${id}`);
        cardValueElem.setAttribute("data-id", String(id));
        cardValueElem.setAttribute("data-stock", String(stock));
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

      const stockElem = productClone.querySelector(".productStock");
      if (stockElem) stockElem.textContent = stock;

      const descElem = productClone.querySelector(".productDescription");
      if (descElem) descElem.textContent = description;

      const priceElem = productClone.querySelector(".productPrice");
      if (priceElem) priceElem.textContent = `₹${price}`;

      const actualPriceElem = productClone.querySelector(".productActualPrice");
      if (actualPriceElem) actualPriceElem.textContent = `₹${(price * 4).toFixed(2)}`;

      const qtyElem = productClone.querySelector(".productQuantity");
      if (qtyElem) {
        qtyElem.textContent = "1";
        qtyElem.setAttribute("data-quantity", "1");
      }

      // Add data-id and data-stock attributes for Controller event delegation
      const addToCartBtn = productClone.querySelector(".add-to-cart-button");
      if (addToCartBtn) {
        addToCartBtn.setAttribute("data-id", String(id));
        addToCartBtn.setAttribute("data-stock", String(stock));
      }

      const stockElemDiv = productClone.querySelector(".stockElement");
      if (stockElemDiv) {
        stockElemDiv.setAttribute("data-id", String(id));
        stockElemDiv.setAttribute("data-stock", String(stock));
      }

      this.container.appendChild(productClone);
    });
  }

  /**
   * Update quantity text on an existing product card
   * @param {number|string} productId 
   * @param {number} newQuantity 
   */
  updateCardQuantity(productId, newQuantity) {
    const cardElem = document.querySelector(`#card${productId}`);
    if (!cardElem) return;

    const qtyElem = cardElem.querySelector(".productQuantity");
    if (qtyElem) {
      qtyElem.textContent = String(newQuantity);
      qtyElem.setAttribute("data-quantity", String(newQuantity));
    }
  }

  /**
   * Read current quantity set on a product card
   * @param {number|string} productId 
   * @returns {number}
   */
  getCardQuantity(productId) {
    const cardElem = document.querySelector(`#card${productId}`);
    if (!cardElem) return 1;

    const qtyElem = cardElem.querySelector(".productQuantity");
    return qtyElem ? parseInt(qtyElem.getAttribute("data-quantity"), 10) || 1 : 1;
  }

  /**
   * Render empty state in product container
   * @param {string} message 
   */
  renderEmptyState(message) {
    if (!this.container) return;
    this.container.innerHTML = `
      <div class="empty-product-state" style="text-align: center; padding: 4rem 1rem; width: 100%; grid-column: 1 / -1;">
        <i class="fa-solid fa-box-open" style="font-size: 4rem; color: #a0aec0; margin-bottom: 1.5rem;"></i>
        <h3 style="font-size: 2rem; color: var(--textColor, #2d3748); margin-bottom: 0.5rem;">No Products Found</h3>
        <p style="font-size: 1.4rem; color: #718096;">${message}</p>
      </div>
    `;
  }

  /**
   * Render category filter buttons into .category-filters container
   * @param {Array<string>} categories 
   * @param {string} [activeCategory='all']
   */
  renderCategories(categories, activeCategory = "all") {
    const filterContainer = document.querySelector(".category-filters");
    if (!filterContainer || !Array.isArray(categories)) return;

    filterContainer.innerHTML = categories
      .map((cat) => {
        const isActive = cat.toLowerCase() === activeCategory.toLowerCase();
        const displayName = cat.charAt(0).toUpperCase() + cat.slice(1);
        return `<button class="category-filter-btn ${isActive ? 'active' : ''}" data-category="${cat}">${displayName}</button>`;
      })
      .join("");
  }
}

export default new ProductView();
