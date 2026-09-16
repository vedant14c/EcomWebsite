import "./style.css";
import CartModel from "./models/CartModel.js";
import SharedView from "./views/SharedView.js";
import ProductController from "./controllers/ProductController.js";
import CartController from "./controllers/CartController.js";
import OrderController from "./controllers/OrderController.js";

/**
 * Application Bootstrapper
 * Detects current page and initializes the appropriate controller.
 */
document.addEventListener("DOMContentLoaded", () => {
  // Always synchronize the navigation cart counter badge on every page
  SharedView.updateCartBadge(CartModel.getCartCount());

  // Product Catalog page (index.html, products.html)
  if (
    document.querySelector("#productContainer") &&
    document.querySelector("#productTemplate")
  ) {
    ProductController.init();
  }

  // Cart page (addToCart.html)
  if (
    document.querySelector("#productCartContainer") &&
    document.querySelector("#productCartTemplate")
  ) {
    CartController.init();
    OrderController.init();
  }
});
