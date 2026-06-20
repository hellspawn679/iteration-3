# DARTH Theme — Architecture Overview

This document explains how the different layers of the DARTH Shopify theme work together. Read this first before making any structural changes.

## High-Level Architecture

```
Browser
  └── Shopify CDN (serves theme)
        └── layout/theme.liquid        ← HTML shell, loads React via <script>
              └── snippets/vite-tag.liquid  ← Resolves hashed JS/CSS filenames
                    └── assets/main-[hash].js   ← Compiled React application
                          └── React Router        ← Handles / and /product/:handle
```

## The React-Shopify Bridge

This theme replaces the standard Shopify Liquid storefront with a **React SPA (Single Page Application)**. The bridge works like this:

1. **`layout/theme.liquid`** renders a minimal HTML page with just a `<div id="root">` and loads the compiled React bundle via `{% render 'vite-tag' with 'main.jsx' %}`.
2. **React Router** (`BrowserRouter`) is set up in `frontend/entrypoints/main.jsx`. It controls all client-side navigation.
3. **Shopify's Liquid templating is bypassed** for all UI rendering. React owns the full DOM inside `#root`. The standard `{{ content_for_layout }}` is hidden with `display: none`.
4. **Data is fetched at runtime** via Shopify's public storefront JSON APIs. No Liquid variables are passed to React.

### Key implication
There is **no SSR (Server-Side Rendering)**. The page is blank until React hydrates. This is intentional — Shopify's Liquid is only used as the HTML delivery mechanism.

---

## Data Flow

```
Shopify Storefront APIs (public, no auth needed)
        │
        │  GET /products.json         → List of all products
        │  GET /products/{handle}.js  → Single product with variants
        │  POST /cart/add.js          → Add item to Shopify cart
        │
        ▼
frontend/utils/shopify.js             ← Transforms raw API responses into clean JS objects
        │
        ▼
App.jsx (state owner)                 ← Holds products[], cartItems[], isCartOpen
        │
        ├── Navbar         ← receives: cartCount, onOpenCart
        ├── Hero           ← no props (static)
        ├── ProductGrid    ← receives: products[], onAddToCart()
        ├── ProductDetail  ← fetches own product via useParams → fetchProduct(handle)
        ├── CartModal      ← receives: isOpen, items[], onClose, onRemove, onUpdateQuantity
        └── Footer         ← no props (static)
```

## Cart Architecture

The cart has a **dual-state** design:

| Layer | What it does |
|-------|-------------|
| **React state** (`cartItems` in App.jsx) | Powers the UI — shows items, quantities, totals in the `CartModal` |
| **Shopify backend cart** (`/cart/add.js`) | Real cart stored server-side by Shopify, used at checkout |

When a user hits **Checkout**, React redirects to `/checkout`, and Shopify's own checkout page takes over, reading from the Shopify-side cart. The two states are kept in sync on every `addToCart` call.

> ⚠️ **Known limitation:** If the user refreshes the page, React's local `cartItems` state resets to empty. The Shopify backend cart still has the items (visible at `/cart`), but the React drawer won't show them. To fix this, `GET /cart.js` should be called on app mount to seed the initial state.

## Routing

Client-side routing is handled by `react-router-dom v7`.

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `App.jsx` → `Hero` + `ProductGrid` | Collection / homepage |
| `/product/:handle` | `ProductDetail` | Single product page (handle from URL) |

> **Shopify URL conflict:** Shopify has its own `/products/:handle` route system. This theme uses `/product/:handle` (singular, no 's') to avoid conflicts. The Shopify route still works for SEO but renders the Liquid template (which is hidden), not the React component.

## Vite Build System

`vite-plugin-shopify` manages the integration between Vite and Shopify:

- In **development** (`npm run dev`): `snippets/vite-tag.liquid` points to `http://localhost:5173` (Vite HMR dev server).
- In **production** (`npm run build`): the snippet is rewritten to reference the hashed asset filenames in the `assets/` folder (e.g., `main-6iOJ7a7n.js`).

> ⚠️ **Critical workflow:** You MUST run `npm run build` and commit the updated `snippets/vite-tag.liquid` before pushing to GitHub for Shopify's GitHub integration to work. See `README.md` for the exact commands.
