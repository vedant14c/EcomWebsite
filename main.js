import "./style.css";
import CartModel from "./models/CartModel.js";
import ProductModel from "./models/ProductModel.js";
import SharedView from "./views/SharedView.js";
import ProductController from "./controllers/ProductController.js";
import CartController from "./controllers/CartController.js";
import OrderController from "./controllers/OrderController.js";

document.addEventListener("DOMContentLoaded", async () => {
  await ProductModel.init();
  await CartModel.init();

  SharedView.updateCartBadge(CartModel.getCartCount());

  if (document.querySelector("#productContainer") && document.querySelector("#productTemplate")) {
    ProductController.init();
  }
  if (document.querySelector("#productCartContainer") && document.querySelector("#productCartTemplate")) {
    CartController.init();
    OrderController.init();
  }
});
