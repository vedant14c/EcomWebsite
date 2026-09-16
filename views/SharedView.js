/**
 * SharedView
 * Manages shared UI elements across all pages: toast notifications and cart badge counter.
 * Strictly decoupled from localStorage.
 */
class SharedView {
  /**
   * Update the navbar shopping cart badge
   * @param {number} count 
   */
  updateCartBadge(count) {
    const cartValueElem = document.querySelector("#cartValue");
    if (cartValueElem) {
      cartValueElem.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> ${count}`;
    }
  }

  /**
   * Display an animated toast notification
   * @param {string} operation ('add' | 'delete' | 'order' | 'info')
   * @param {number|string|null} id 
   * @param {string} [customMessage] 
   */
  showToast(operation, id, customMessage = "") {
    const existingToast = document.querySelector(".toast");
    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement("div");
    toast.classList.add("toast");

    if (customMessage) {
      toast.textContent = customMessage;
    } else if (operation === "add") {
      toast.textContent = `Product with ID ${id} has been added to your cart.`;
    } else if (operation === "delete") {
      toast.textContent = `Product with ID ${id} has been removed from your cart.`;
    } else if (operation === "order") {
      toast.textContent = `Order ${id ? '#' + id : ''} has been placed successfully!`;
    } else {
      toast.textContent = `Notice: ${id || "Action completed"}`;
    }

    document.body.appendChild(toast);

    setTimeout(() => {
      if (toast && toast.parentNode) {
        toast.remove();
      }
    }, 2500);
  }

  /**
   * Render standard footer if container exists and is empty
   * @param {string} [containerSelector=".section-footer"]
   */
  renderFooter(containerSelector = ".section-footer") {
    const footerElem = document.querySelector(containerSelector);
    if (!footerElem || footerElem.children.length > 0) return;

    footerElem.innerHTML = `
      <div class="footer-container container">
        <div class="content_1">
          <img src="/images/images.jpeg" alt="logo" />
          <p>
            Welcome to TechNest EcomStore, your ultimate destination for
            cutting-edge gadgets!
          </p>
          <img src="https://i.postimg.cc/Nj9dgJ98/cards.png" alt="cards" />
        </div>
        <div class="content_2">
          <h4>SHOPPING</h4>
          <a href="#">Computer Store</a>
          <a href="#">Laptop Store</a>
          <a href="#">Accessories</a>
          <a href="#">Sales & Discount</a>
        </div>
        <div class="content_3">
          <h4>Experience</h4>
          <a href="./contact.html">Contact Us</a>
          <a href="" target="_blank">Payment Method</a>
          <a href="" target="_blank">Delivery</a>
          <a href="" target="_blank">Return and Exchange</a>
        </div>
        <div class="content_4">
          <h4>NEWSLETTER</h4>
          <p>Be the first to know about new<br />arrivals, sales & promos!</p>
          <div class="f-mail">
            <input type="email" placeholder="Your Email" />
            <i class="bx bx-envelope"></i>
          </div>
          <hr />
        </div>
      </div>
      <div class="f-design">
        <div class="f-design-txt">
          <p>Design and Code by Maxgen Technology</p>
        </div>
      </div>
    `;
  }
}

export default new SharedView();
