# Project Change Tracker & Documentation
**Project:** TechNest E-Commerce Web Application  
**Tech Stack:** HTML5, CSS3, ES6 JavaScript, Vite 5  
**Initialized:** September 16, 2026  

---

## 📌 Document Overview
This document tracks all modifications, date-wise project evolution, bug fixes, milestone schedules, and architectural changes for the TechNest codebase.

---

## 📅 Date-Wise Project Timeline

```text
2026-09-02          2026-09-05          2026-09-10          2026-09-14          2026-09-16          2026-09-20          2026-09-28
    │                   │                   │                   │                   │                   │                   │
    ▼                   ▼                   ▼                   ▼                   ▼                   ▼                   ▼
Requirements        UI & CSS Design     JS Prototype        Codebase Audit       MVC Refactor        Enhancements        Final Delivery
(Scope & Specs)     (Layout & Assets)   (Cart & Products)   (Bug Cataloging)     (Models/Views/Ctrl) (Order History)     (Production Build)
```

### Chronological Milestones by Date

| Date | Phase / Sprint | Focus & Milestone | Key Deliverables & Actions Taken | Status |
|---|---|---|---|---|
| **2026-09-02** | **Sprint 1: Inception** | Requirements & System Scope | • Outlined product catalog requirements for electronics e-commerce store<br>• Finalized tech stack: HTML5, CSS3, ES6 Modules, Vite 5, localStorage<br>• Initialized multi-page project directory structure | ✅ Completed |
| **2026-09-05** | **Sprint 2: UI Design** | Layout & Styling Architecture | • Structured multi-page HTML wireframes (`index`, `products`, `addToCart`, `about`, `contact`)<br>• Developed custom CSS design system (`style.css` - 1200+ lines)<br>• Integrated FontAwesome 6 icon library & Google Fonts typography | ✅ Completed |
| **2026-09-10** | **Sprint 3: Prototype** | Initial Procedural Prototype | • Implemented procedural DOM scripts (`homeProductCards.js`, `addToCart.js`)<br>• Configured client-side cart persistence via `localStorage` (`cartProductLS`)<br>• Built mock product JSON feed (`api/products.json`) | ✅ Completed |
| **2026-09-14** | **Sprint 4: Audit & QA** | Codebase Audit & Bug Detection | • Deep scan of all modules, HTML templates, and event logic<br>• Cataloged 6 baseline bugs (BUG-001 through BUG-006)<br>• Created initial project tracking documentation (`docs/CHANGE_TRACKER.md`) | ✅ Completed |
| **2026-09-16** | **Sprint 5: Refactoring** | Pure MVC Architecture & Bug Fixes | • Full architectural refactor into clean Model-View-Controller pattern:<br>&nbsp;&nbsp;▫ **Models:** `ProductModel.js`, `CartModel.js`, `OrderModel.js`<br>&nbsp;&nbsp;▫ **Views:** `ProductView.js`, `CartView.js`, `CheckoutView.js`, `SharedView.js`<br>&nbsp;&nbsp;▫ **Controllers:** `ProductController.js`, `CartController.js`, `OrderController.js`<br>• Enforced Controller event ownership & Model business logic encapsulation<br>• Rebuilt `main.js` into a lightweight, safe application router<br>• Fixed all 6 identified baseline bugs (null references, toast typos, asset paths)<br>• Added real-time Search & Category Filters and Demo Checkout modal | ✅ Completed |
| **2026-09-20** | **Sprint 6: Enhancement** | Checkout Polish & Order History | • Build dedicated Order History page (`orders.html`) using `OrderModel`<br>• Enhanced input formatting and validation for customer details | ⏳ Scheduled |
| **2026-09-24** | **Sprint 7: Validation** | Cross-Browser & Performance QA | • Cross-browser testing across Chrome, Firefox, Edge, and mobile viewports<br>• Lighthouse performance audit and asset minification check | ⏳ Scheduled |
| **2026-09-28** | **Sprint 8: Delivery** | Final Release & Project Submission | • Final production bundle build test (`npm run build`)<br>• Complete technical documentation sign-off and MCA project delivery | ⏳ Scheduled |

---

## 📋 Change Log

### [v2.0.1] - Obsolete Legacy Code Cleanup (2026-09-16)
* **Type:** Cleanup / Deprecation Removal
* **Files Removed:**
  * `addToCart.js`, `getCartProducts.js`, `incrementDecrement.js`, `removeProdFromCart.js`, `updateCartProductTotal.js`, `fetchQuantityFromCartLS.js`, `homeProductCards.js`, `homeQuantityToggle.js`, `updateCartValue.js`, `showAddToCartCards.js`, `showToast.js`, `footer.js`
* **Details:**
  * Searched entire codebase for lingering imports or references to old procedural scripts (0 references found).
  * Removed all 12 obsolete files cleanly.
  * Verified all HTML entry points reference only `main.js`.
  * Verified 35/35 test suite assertions pass and `npm run build` succeeds with zero errors.
* **Status:** Completed

---

### [v2.0.0] - MVC Architecture Refactoring (2026-09-16)
* **Type:** Architectural Refactor & Bug Fixes
* **Files Added:**
  * `data/products.json` - Standardized mock product data with clean `/images/...` paths
  * `models/ProductModel.js` - Data and query layer for products (search, filter, lookup)
  * `models/CartModel.js` - Cart state, calculations, and stock validation with `cartProductLS`
  * `models/OrderModel.js` - Order creation and persistence with `ordersLS`
  * `views/SharedView.js` - Shared UI logic: toast notifications and header cart counter
  * `views/ProductView.js` - Clones `<template id="productTemplate">` and renders products
  * `views/CartView.js` - Clones `<template id="productCartTemplate">` and renders cart items/totals
  * `views/CheckoutView.js` - Renders demo checkout modal, validation errors, and confirmation
  * `controllers/ProductController.js` - Owns product catalog event handling, search, and category filter
  * `controllers/CartController.js` - Owns cart event handling (increment, decrement, remove)
  * `controllers/OrderController.js` - Owns checkout submission, form validation, and order placement
* **Files Modified:**
  * `main.js` - Refactored into a lightweight application bootstrapper and page detector
  * `about.html` - Linked `style.css`, standardized image paths to `/images/...`, resolved runtime error
  * `contact.html` - Standardized image paths to `/images/...`, unified footer, connected to `main.js`
  * `addToCart.html` - Standardized images, added Proceed to Checkout button, connected to `main.js`
  * `products.html` - Standardized images, added real-time Search & Category Filter bar
  * `index.html` - Standardized images, added real-time Search & Category Filter bar
  * `style.css` - Added complementary styling for search input and category filter buttons
* **Details:**
  * Decoupled procedural scripts into strict Model-View-Controller architecture.
  * Models handle state, business rules, and `localStorage` without any DOM access.
  * Views handle DOM rendering only without attaching event listeners or business logic.
  * Controllers own event handling via event delegation and coordinate Models with Views.
  * Fixed all 6 identified baseline bugs (null template references, toast operation mix-up, missing arguments, missing styles, and inconsistent asset paths).
* **Status:** Completed

---

### [v1.0.0] - Baseline & Project Audit (2026-09-14)
* **Type:** Audit & Setup
* **Summary:** Initial scan, baseline analysis of the project structure, and creation of documentation & tracking system.
* **Key Observations:**
  * Multi-page Vite application (`index.html`, `products.html`, `addToCart.html`, `about.html`, `contact.html`).
  * Dynamic product rendering using HTML5 `<template id="productTemplate">` and `api/products.json`.
  * Client-side cart state stored in `localStorage` under key `cartProductLS`.
  * Comprehensive custom stylesheet in `style.css` (~1200 lines).

---

## 🔍 Identified Issues & Resolution Status

| ID | Priority | Location | Description | Status |
|---|---|---|---|---|
| **BUG-001** | High | `about.html`, `contact.html`, `main.js` | Importing `main.js` executes `showProductContainer()` looking for `#productTemplate`, which does not exist on About and Contact pages, throwing a null reference runtime error. | **Fixed in v2.0.0** (Conditional controller bootstrap in `main.js`) |
| **BUG-002** | Medium | `about.html` | Missing `<link rel="stylesheet" href="style.css" />` tag in the `<head>` section. | **Fixed in v2.0.0** (Added link in `<head>`) |
| **BUG-003** | Medium | `addToCart.js` (Line 45) | Calls `showToast('delet', id)` when adding a new item to the cart, displaying `"Product with ID X has been deleted"` instead of `"added"`. | **Fixed in v2.0.0** (`SharedView` and `ProductController` invoke `'add'`) |
| **BUG-004** | Low | `removeProdFromCart.js` (Line 15) | Calls `showToast()` without passing `operation` or `id`, resulting in `"Product with ID undefined has been deleted."` | **Fixed in v2.0.0** (`CartController` passes `'delete'` and `productId`) |
| **BUG-005** | Low | `api/products.json` & HTML files | Inconsistent image paths (`../images/...` in JSON vs `public/images/...` in HTML). In Vite, public assets are served directly from `/images/...`. | **Fixed in v2.0.0** (Standardized all paths to `/images/...`) |
| **BUG-006** | Low | `footer.js` vs HTML Footers | Inconsistent branding and hardcoded footer markup across pages ("Thapa EcomStore" vs "TechNest EcomStore"). | **Fixed in v2.0.0** (Unified standard footer markup across pages) |

---

## 📝 Change Log Entry Template
Use the following format for future changes:

```markdown
### [YYYY-MM-DD] - <Change Title>
* **Type:** <Bug Fix | Feature | UI/UX Improvement | Refactoring | Documentation>
* **Files Modified:**
  * `path/to/file1.ext` - Brief description of change
  * `path/to/file2.ext` - Brief description of change
* **Details:**
  * Explanation of what was modified and why.
* **Testing / Verification:**
  * How the change was tested and verified.
* **Status:** Completed
```
