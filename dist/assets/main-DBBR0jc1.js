(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))a(o);new MutationObserver(o=>{for(const r of o)if(r.type==="childList")for(const n of r.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&a(n)}).observe(document,{childList:!0,subtree:!0});function e(o){const r={};return o.integrity&&(r.integrity=o.integrity),o.referrerPolicy&&(r.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?r.credentials="include":o.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(o){if(o.ep)return;o.ep=!0;const r=e(o);fetch(o.href,r)}})();class M{constructor(){this.storageKey="cartProductLS"}getCart(){try{const t=localStorage.getItem(this.storageKey);return t?JSON.parse(t):[]}catch(t){return console.error("CartModel: Error reading cart from localStorage",t),[]}}saveCart(t){try{localStorage.setItem(this.storageKey,JSON.stringify(t))}catch(e){console.error("CartModel: Error saving cart to localStorage",e)}}addToCart(t,e,a,o){const r=Number(t),n=Math.max(1,Math.min(Number(e)||1,a)),i=Number(o)||0,c=this.getCart(),d=c.findIndex(m=>m.id===r);let u=!1,s=null;if(d>-1){const m=Number(c[d].quantity)||1,g=Math.min(m+n,a),f=Number((g*i).toFixed(2));c[d]={...c[d],quantity:g,price:f},s=c[d],u=!1}else{const m=Number((n*i).toFixed(2));s={id:r,quantity:n,price:m},c.push(s),u=!0}return this.saveCart(c),{success:!0,isNew:u,item:s,cart:c}}increaseQuantity(t,e,a){const o=Number(t),r=this.getCart(),n=r.findIndex(c=>c.id===o);if(n===-1)return{success:!1,item:null,cart:r};const i=Number(r[n].quantity)||1;if(i<e){const c=i+1,d=Number((c*a).toFixed(2));return r[n]={...r[n],quantity:c,price:d},this.saveCart(r),{success:!0,item:r[n],cart:r}}return{success:!1,item:r[n],cart:r}}decreaseQuantity(t,e){const a=Number(t),o=this.getCart(),r=o.findIndex(i=>i.id===a);if(r===-1)return{success:!1,item:null,cart:o};const n=Number(o[r].quantity)||1;if(n>1){const i=n-1,c=Number((i*e).toFixed(2));return o[r]={...o[r],quantity:i,price:c},this.saveCart(o),{success:!0,item:o[r],cart:o}}return{success:!1,item:o[r],cart:o}}removeFromCart(t){const e=Number(t),a=this.getCart().filter(o=>o.id!==e);return this.saveCart(a),a}calculateSubtotal(){const e=this.getCart().reduce((a,o)=>a+(Number(o.price)||0),0);return Number(e.toFixed(2))}calculateTax(t){return t>0?50:0}calculateFinalTotal(){const t=this.calculateSubtotal(),e=this.calculateTax(t);return Number((t+e).toFixed(2))}getSubtotal(){return this.calculateSubtotal()}getTax(){return this.calculateTax(this.calculateSubtotal())}getTotal(){return this.calculateFinalTotal()}getCartCount(){return this.getCart().length}clearCart(){this.saveCart([])}}const l=new M;class B{updateCartBadge(t){const e=document.querySelector("#cartValue");e&&(e.innerHTML=`<i class="fa-solid fa-cart-shopping"></i> ${t}`)}showToast(t,e,a=""){const o=document.querySelector(".toast");o&&o.remove();const r=document.createElement("div");r.classList.add("toast"),a?r.textContent=a:t==="add"?r.textContent=`Product with ID ${e} has been added to your cart.`:t==="delete"?r.textContent=`Product with ID ${e} has been removed from your cart.`:t==="order"?r.textContent=`Order ${e?"#"+e:""} has been placed successfully!`:r.textContent=`Notice: ${e||"Action completed"}`,document.body.appendChild(r),setTimeout(()=>{r&&r.parentNode&&r.remove()},2500)}renderFooter(t=".section-footer"){const e=document.querySelector(t);!e||e.children.length>0||(e.innerHTML=`
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
    `)}}const h=new B,A=[{id:1,name:"Laptop",category:"Computers",brand:"ExampleBrand",price:999.99,stock:50,description:"Powerful laptop with a quad-core i5 processor, 8GB RAM, 256GB SSD, and a 14-inch FHD display.",image:"/images/lapi.png"},{id:2,name:"Smartphone",category:"Mobiles",brand:"TechGadget",price:499.99,stock:100,image:"/images/iphone.png",description:"Feature-rich smartphone with a 6.2-inch screen, 12MP dual camera, 128GB storage, and a 4000mAh battery."},{id:3,name:"Wireless Headphones",category:"Audio",brand:"SoundBeats",price:149.99,stock:30,image:"/images/headphone.png",description:"High-quality wireless headphones with over-ear design, 20 hours of battery life, and a sleek black color."},{id:4,name:"Watches",category:"Wearables",brand:"FitTech",price:199.99,stock:20,image:"/images/watch.png",description:"Smartwatch with a 1.3-inch AMOLED display, water-resistant design, fitness tracking features, and a stylish silver color."},{id:5,name:"Speakers",category:"Audio",brand:"SoundBeats",price:149.99,stock:30,image:"/images/speakers.png",description:"High-quality Bluetooth speakers delivering crystal clear audio, deep bass, and 20 hours playback."},{id:6,name:"Television",category:"Video",brand:"Samsung",price:199.99,stock:20,image:"/images/tv.png",description:"Ultra HD 4K Smart TV with vibrant HDR display, smart voice assistant, and seamless streaming support."}];class O{constructor(){this.products=Array.isArray(A)?[...A]:[]}loadProducts(){return this.getProducts()}getProducts(){return[...this.products]}getProductById(t){const e=Number(t);return this.products.find(a=>a.id===e)||null}searchProducts(t){if(!t||typeof t!="string")return this.getProducts();const e=t.trim().toLowerCase();return e?this.products.filter(a=>{var c,d,u,s;const o=(c=a.name)==null?void 0:c.toLowerCase().includes(e),r=(d=a.category)==null?void 0:d.toLowerCase().includes(e),n=(u=a.brand)==null?void 0:u.toLowerCase().includes(e),i=(s=a.description)==null?void 0:s.toLowerCase().includes(e);return o||r||n||i}):this.getProducts()}filterByCategory(t){return!t||t.toLowerCase()==="all"?this.getProducts():this.products.filter(e=>e.category.toLowerCase()===t.toLowerCase())}getCategories(){const t=new Set(this.products.map(e=>e.category));return["all",...Array.from(t)]}}const C=new O;class N{constructor(){this.container=null,this.template=null}initElements(){return this.container=document.querySelector("#productContainer"),this.template=document.querySelector("#productTemplate"),!!(this.container&&this.template)}renderProducts(t){if(this.initElements()){if(this.container.innerHTML="",!t||t.length===0){this.renderEmptyState("No products found matching your selection.");return}t.forEach(e=>{const{brand:a,category:o,description:r,id:n,image:i,name:c,price:d,stock:u}=e,s=document.importNode(this.template.content,!0),m=s.querySelector("#cardValue");m&&(m.setAttribute("id",`card${n}`),m.setAttribute("data-id",String(n)),m.setAttribute("data-stock",String(u)));const g=s.querySelector(".category");g&&(g.textContent=o);const f=s.querySelector(".productName");f&&(f.textContent=c);const y=s.querySelector(".productImage");y&&(y.src=i,y.alt=c);const v=s.querySelector(".productStock");v&&(v.textContent=u);const x=s.querySelector(".productDescription");x&&(x.textContent=r);const w=s.querySelector(".productPrice");w&&(w.textContent=`₹${d}`);const E=s.querySelector(".productActualPrice");E&&(E.textContent=`₹${(d*4).toFixed(2)}`);const S=s.querySelector(".productQuantity");S&&(S.textContent="1",S.setAttribute("data-quantity","1"));const q=s.querySelector(".add-to-cart-button");q&&(q.setAttribute("data-id",String(n)),q.setAttribute("data-stock",String(u)));const T=s.querySelector(".stockElement");T&&(T.setAttribute("data-id",String(n)),T.setAttribute("data-stock",String(u))),this.container.appendChild(s)})}}updateCardQuantity(t,e){const a=document.querySelector(`#card${t}`);if(!a)return;const o=a.querySelector(".productQuantity");o&&(o.textContent=String(e),o.setAttribute("data-quantity",String(e)))}getCardQuantity(t){const e=document.querySelector(`#card${t}`);if(!e)return 1;const a=e.querySelector(".productQuantity");return a&&parseInt(a.getAttribute("data-quantity"),10)||1}renderEmptyState(t){this.container&&(this.container.innerHTML=`
      <div class="empty-product-state" style="text-align: center; padding: 4rem 1rem; width: 100%; grid-column: 1 / -1;">
        <i class="fa-solid fa-box-open" style="font-size: 4rem; color: #a0aec0; margin-bottom: 1.5rem;"></i>
        <h3 style="font-size: 2rem; color: var(--textColor, #2d3748); margin-bottom: 0.5rem;">No Products Found</h3>
        <p style="font-size: 1.4rem; color: #718096;">${t}</p>
      </div>
    `)}renderCategories(t,e="all"){const a=document.querySelector(".category-filters");!a||!Array.isArray(t)||(a.innerHTML=t.map(o=>{const r=o.toLowerCase()===e.toLowerCase(),n=o.charAt(0).toUpperCase()+o.slice(1);return`<button class="category-filter-btn ${r?"active":""}" data-category="${o}">${n}</button>`}).join(""))}}const k=new N;class L{constructor(){this.currentCategory="all",this.currentSearchQuery=""}init(){h.updateCartBadge(l.getCartCount()),this.renderCatalog(),this.attachEventListeners()}renderCatalog(){let t=C.getProducts();this.currentCategory&&this.currentCategory!=="all"&&(t=C.filterByCategory(this.currentCategory)),this.currentSearchQuery&&(t=C.searchProducts(this.currentSearchQuery),this.currentCategory&&this.currentCategory!=="all"&&(t=t.filter(e=>e.category.toLowerCase()===this.currentCategory.toLowerCase()))),k.renderProducts(t)}attachEventListeners(){const t=document.querySelector("#productContainer");t&&!t.dataset.listenerAttached&&(t.dataset.listenerAttached="true",t.addEventListener("click",o=>{const r=o.target.closest(".cartIncrement"),n=o.target.closest(".cartDecrement");if(r||n){const c=o.target.closest(".cards");if(!c)return;const d=c.getAttribute("data-id"),u=parseInt(c.getAttribute("data-stock"),10)||1,s=k.getCardQuantity(d);r?s<u&&k.updateCardQuantity(d,s+1):n&&s>1&&k.updateCardQuantity(d,s-1);return}if(o.target.closest(".add-to-cart-button")){const c=o.target.closest(".cards");if(!c)return;const d=c.getAttribute("data-id"),u=C.getProductById(d);if(!u)return;const s=k.getCardQuantity(d);l.addToCart(d,s,u.stock,u.price),h.updateCartBadge(l.getCartCount()),h.showToast("add",d)}}));const e=document.querySelector("#productSearchInput");e&&!e.dataset.listenerAttached&&(e.dataset.listenerAttached="true",e.addEventListener("input",o=>{this.currentSearchQuery=o.target.value,this.renderCatalog()}));const a=document.querySelector(".category-filters");a&&!a.dataset.listenerAttached&&(a.dataset.listenerAttached="true",a.addEventListener("click",o=>{const r=o.target.closest(".category-filter-btn");if(!r)return;a.querySelectorAll(".category-filter-btn").forEach(i=>i.classList.remove("active")),r.classList.add("active"),this.currentCategory=r.getAttribute("data-category")||"all",this.renderCatalog()}))}}const I=new L;class ${constructor(){this.cartContainer=null,this.cartTemplate=null,this.subTotalElem=null,this.taxElem=null,this.finalTotalElem=null}initElements(){return this.cartContainer=document.querySelector("#productCartContainer"),this.cartTemplate=document.querySelector("#productCartTemplate"),this.subTotalElem=document.querySelector(".productSubTotal"),this.taxElem=document.querySelector(".productTax"),this.finalTotalElem=document.querySelector(".productFinalTotal"),!!(this.cartContainer&&this.cartTemplate)}renderCart(t,e){if(!this.initElements())return;if(this.cartContainer.innerHTML="",this.updateTotals(e),!t||t.length===0){this.renderEmptyCart();return}const a=document.querySelector("#proceedCheckoutBtn");a&&(a.style.display="flex"),t.forEach(o=>{const{id:r,name:n,category:i,image:c,quantity:d,price:u}=o,s=document.importNode(this.cartTemplate.content,!0),m=s.querySelector("#cardValue");m&&(m.setAttribute("id",`card${r}`),m.setAttribute("data-id",String(r)));const g=s.querySelector(".category");g&&(g.textContent=i);const f=s.querySelector(".productName");f&&(f.textContent=n);const y=s.querySelector(".productImage");y&&(y.src=c,y.alt=n);const v=s.querySelector(".productQuantity");v&&(v.textContent=String(d),v.setAttribute("data-quantity",String(d)));const x=s.querySelector(".productPrice");x&&(x.textContent=`₹${u}`);const w=s.querySelector(".cartIncrement");w&&w.setAttribute("data-id",String(r));const E=s.querySelector(".cartDecrement");E&&E.setAttribute("data-id",String(r));const S=s.querySelector(".remove-to-cart-button");S&&S.setAttribute("data-id",String(r)),this.cartContainer.appendChild(s)})}updateTotals({subtotal:t=0,tax:e=0,finalTotal:a=0}={}){this.subTotalElem&&(this.subTotalElem.textContent=`₹${t}`),this.taxElem&&(this.taxElem.textContent=`₹${e}`),this.finalTotalElem&&(this.finalTotalElem.textContent=`₹${a}`)}updateSummary(t=0,e=0,a=0){this.updateTotals({subtotal:t,tax:e,finalTotal:a})}renderEmptyCart(){if(!this.cartContainer)return;this.cartContainer.innerHTML=`
      <div class="empty-cart-card" style="text-align: center; padding: 4rem 2rem; background: #ffffff; border-radius: 1rem; box-shadow: 0 4px 12px rgba(0,0,0,0.05); margin-bottom: 2rem;">
        <i class="fa-solid fa-cart-arrow-down" style="font-size: 5rem; color: #a0aec0; margin-bottom: 1.5rem;"></i>
        <h3 style="font-size: 2.2rem; color: var(--textColor, #2d3748); margin-bottom: 0.8rem;">Your Cart is Empty</h3>
        <p style="font-size: 1.6rem; color: #718096; margin-bottom: 2rem;">Looks like you haven't added any gadgets to your cart yet.</p>
        <a href="products.html" class="btn" style="display: inline-block; padding: 1rem 2.4rem; border-radius: 0.5rem; background: var(--buttonColor, #2a2c30); color: #fff; font-size: 1.6rem; text-decoration: none;">
          <i class="fa-solid fa-store" style="margin-right: 0.8rem;"></i>Explore Products
        </a>
      </div>
    `;const t=document.querySelector("#proceedCheckoutBtn");t&&(t.style.display="none")}}const z=new $;class F{init(){h.updateCartBadge(l.getCartCount()),this.renderCart(),this.attachEventListeners()}renderCart(){const e=l.getCart().map(n=>{const i=C.getProductById(n.id);return i?{id:n.id,quantity:n.quantity,price:n.price,unitPrice:i.price,name:i.name,category:i.category,image:i.image,stock:i.stock}:null}).filter(Boolean),a=l.calculateSubtotal(),o=l.calculateTax(a),r=l.calculateFinalTotal();z.renderCart(e,{subtotal:a,tax:o,finalTotal:r})}attachEventListeners(){const t=document.querySelector("#productCartContainer");t&&!t.dataset.listenerAttached&&(t.dataset.listenerAttached="true",t.addEventListener("click",e=>{const a=e.target.closest(".cartIncrement");if(a){const n=a.getAttribute("data-id"),i=C.getProductById(n);i&&(l.increaseQuantity(n,i.stock,i.price),this.renderCart());return}const o=e.target.closest(".cartDecrement");if(o){const n=o.getAttribute("data-id"),i=C.getProductById(n);i&&(l.decreaseQuantity(n,i.price),this.renderCart());return}const r=e.target.closest(".remove-to-cart-button");if(r){const n=r.getAttribute("data-id");l.removeFromCart(n),h.updateCartBadge(l.getCartCount()),h.showToast("delete",n),this.renderCart()}}))}}const P=new F;class Q{constructor(){this.storageKey="ordersLS"}getOrders(){try{const t=localStorage.getItem(this.storageKey);return t?JSON.parse(t):[]}catch(t){return console.error("OrderModel: Error reading orders from localStorage",t),[]}}saveOrders(t){try{localStorage.setItem(this.storageKey,JSON.stringify(t))}catch(e){console.error("OrderModel: Error saving orders to localStorage",e)}}saveOrder(t){const e=this.getOrders();return e.push(t),this.saveOrders(e),t}generateOrderId(){return`TN-${Math.floor(1e4+Math.random()*9e4)}`}createOrder(t,e,a,o,r){const i={orderId:this.generateOrderId(),date:new Date().toISOString(),customer:{name:t.name||"",email:t.email||"",phone:t.phone||"",address:t.address||""},items:Array.isArray(e)?[...e]:[],subtotal:Number(a)||0,tax:Number(o)||0,finalTotal:Number(r)||0,status:"Confirmed"},c=this.getOrders();return c.push(i),this.saveOrders(c),i}}const V=new Q;class D{constructor(){this.modalOverlay=null}ensureModalWrapper(){let t=document.querySelector("#checkoutModalOverlay");return t||(t=document.createElement("div"),t.id="checkoutModalOverlay",t.style.position="fixed",t.style.top="0",t.style.left="0",t.style.width="100vw",t.style.height="100vh",t.style.backgroundColor="rgba(0, 0, 0, 0.65)",t.style.display="none",t.style.alignItems="center",t.style.justifyContent="center",t.style.zIndex="10000",document.body.appendChild(t)),this.modalOverlay=t,t}renderCheckoutForm(t){const e=this.ensureModalWrapper();e.innerHTML=`
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
            <strong>₹${t.subtotal}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.4rem;">
            <span>Shipping / Handling:</span>
            <strong>₹${t.tax}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 1.6rem; font-weight: 700; border-top: 1px dashed #cbd5e0; padding-top: 0.6rem; margin-top: 0.6rem;">
            <span>Total Payable:</span>
            <span style="color: var(--main-color, #535bf2);">₹${t.finalTotal}</span>
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
              <i class="fa-solid fa-lock"></i> Place Order (₹${t.finalTotal})
            </button>
          </div>
        </form>
      </div>
    `,e.style.display="flex"}showValidationError(t){const e=document.querySelector("#checkoutErrorMsg");e&&(e.textContent=t,e.style.display="block")}renderOrderConfirmation(t){const e=this.ensureModalWrapper();e.innerHTML=`
      <div class="checkout-modal-card" style="background: #ffffff; border-radius: 1.2rem; max-width: 480px; width: 90%; padding: 2.5rem; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.25);">
        <div style="width: 65px; height: 65px; border-radius: 50%; background: #e6fffa; color: #38b2ac; display: flex; align-items: center; justify-content: center; font-size: 3rem; margin: 0 auto 1.2rem;">
          <i class="fa-solid fa-check"></i>
        </div>

        <h2 style="font-size: 2.4rem; color: #1a202c; margin-bottom: 0.4rem;">Order Placed!</h2>
        <p style="font-size: 1.4rem; color: #718096; margin-bottom: 1.5rem;">Thank you, <strong>${t.customer.name}</strong>!</p>

        <div style="background: #f7fafc; border: 1px solid #e2e8f0; border-radius: 0.8rem; padding: 1.2rem; text-align: left; margin-bottom: 1.5rem; font-size: 1.4rem;">
          <p style="margin-bottom: 0.4rem;"><strong>Order ID:</strong> <span style="color: var(--main-color, #535bf2); font-weight: 700;">${t.orderId}</span></p>
          <p style="margin-bottom: 0.4rem;"><strong>Total Amount:</strong> ₹${t.finalTotal}</p>
          <p style="margin-bottom: 0.4rem;"><strong>Deliver to:</strong> ${t.customer.address}</p>
          <p style="color: #718096; font-size: 1.2rem; margin-top: 0.6rem; border-top: 1px solid #e2e8f0; padding-top: 0.4rem;">
            Estimated delivery within 2-4 business days.
          </p>
        </div>

        <button id="orderContinueShoppingBtn" class="btn" style="padding: 1rem 2.4rem; background: var(--buttonColor, #2a2c30); color: #fff; border: none; border-radius: 0.6rem; font-size: 1.5rem; cursor: pointer; display: inline-flex; align-items: center; gap: 0.8rem;">
          <i class="fa-solid fa-store"></i> Continue Shopping
        </button>
      </div>
    `,e.style.display="flex"}hideModal(){this.modalOverlay&&(this.modalOverlay.style.display="none")}showCheckoutModal(t){this.renderCheckoutForm(t)}hideCheckoutModal(){this.hideModal()}getFormData(){const t=document.querySelector("#checkoutForm");return t?{name:t.custName?t.custName.value.trim():"",phone:t.custPhone?t.custPhone.value.trim():"",email:t.custEmail?t.custEmail.value.trim():"",address:t.custAddress?t.custAddress.value.trim():""}:{}}showOrderConfirmation(t){this.renderOrderConfirmation(t)}}const b=new D;class H{init(){const t=document.querySelector("#proceedCheckoutBtn");t&&!t.dataset.listenerAttached&&(t.dataset.listenerAttached="true",t.addEventListener("click",()=>this.handleOpenCheckout()))}handleOpenCheckout(){const t=l.getCart();if(!t||t.length===0){h.showToast("info",null,"Your cart is empty! Add products before checking out.");return}const e=l.calculateSubtotal(),a=l.calculateTax(e),o=l.calculateFinalTotal();b.renderCheckoutForm({subtotal:e,tax:a,finalTotal:o}),this.attachModalListeners()}attachModalListeners(){const t=document.querySelector("#checkoutModalOverlay");if(!t)return;const e=t.querySelector("#closeCheckoutModalBtn"),a=t.querySelector("#cancelCheckoutBtn"),o=()=>b.hideModal();e&&(e.onclick=o),a&&(a.onclick=o);const r=t.querySelector("#checkoutForm");r&&(r.onsubmit=n=>{n.preventDefault();const i={name:r.custName?r.custName.value.trim():"",phone:r.custPhone?r.custPhone.value.trim():"",email:r.custEmail?r.custEmail.value.trim():"",address:r.custAddress?r.custAddress.value.trim():""};this.processOrder(i)})}processOrder(t){if(!t.name||t.name.length<2){b.showValidationError("Please enter a valid full name.");return}if(t.phone.replace(/\D/g,"").length<8){b.showValidationError("Please enter a valid phone number (at least 8 digits).");return}if(!t.address||t.address.length<5){b.showValidationError("Please enter your delivery address.");return}const a=l.getCart(),o=l.calculateSubtotal(),r=l.calculateTax(o),n=l.calculateFinalTotal(),i=V.createOrder(t,a,o,r,n);l.clearCart(),h.updateCartBadge(0),P.renderCart(),b.renderOrderConfirmation(i);const c=document.querySelector("#orderContinueShoppingBtn");c&&(c.onclick=()=>{b.hideModal(),window.location.href="products.html"}),h.showToast("order",i.orderId)}}const j=new H;document.addEventListener("DOMContentLoaded",()=>{h.updateCartBadge(l.getCartCount()),document.querySelector("#productContainer")&&document.querySelector("#productTemplate")&&I.init(),document.querySelector("#productCartContainer")&&document.querySelector("#productCartTemplate")&&(P.init(),j.init())});
