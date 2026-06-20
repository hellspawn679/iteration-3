# Shopify API Reference

All API calls are made from `frontend/utils/shopify.js`. These are Shopify's **public storefront APIs** — no authentication is required. They are available on any Shopify store domain.

---

## `fetchProducts()` — Product Listing

**Endpoint:** `GET /products.json`  
**Used in:** `App.jsx` (on mount)  
**Returns:** Array of transformed product objects

### Transformation notes
- Price is read from `variants[0]` and parsed to a float (already in INR, e.g. `1400.00`)
- `compare_at_price` is parsed to float if present, otherwise `null`
- `discountPercent` is computed as `Math.round(((compare - price) / compare) * 100)`
- `image` = first image URL, `secondaryImage` = second image URL (for hover swap)
- `id` is set to `variants[0].id` (the variant ID as a string), **not** the product ID
- `status` is `'IN_STOCK'` if `variants[0].available`, else `'SOLD_OUT'`

### Returned object shape
```js
{
  id: "48123456789",          // variant ID (string)
  handle: "black-oversized-tee",
  name: "Black Oversized Tee",
  price: 1200,
  compareAtPrice: 1500,       // null if no sale
  discountPercent: 20,        // null if no sale
  image: "https://cdn.shopify.com/...",
  secondaryImage: "https://cdn.shopify.com/...",
  images: ["https://...", "https://..."],
  status: "IN_STOCK",
  type: "APPAREL",
  hasVariants: true,
  colorCount: 2,
  colorValues: ["Black", "White"]
}
```

---

## `fetchProduct(handle)` — Single Product Detail

**Endpoint:** `GET /products/{handle}.js`  
**Used in:** `ProductDetail.jsx`  
**Returns:** Single transformed product object with full variant data

### Transformation notes
- ⚠️ **Price is in cents from this endpoint** — must be divided by 100 to get INR (`parseFloat(v.price) / 100`)
- Image URLs from this endpoint are **protocol-relative** (start with `//`), so they are prefixed with `https:`
- Each variant includes `options: [optionValue1, optionValue2, ...]` for matching against `selectedOptions`

### Returned object shape
```js
{
  id: "48123456789",          // first variant ID
  handle: "black-oversized-tee",
  name: "Black Oversized Tee",
  price: 1200,
  compareAtPrice: 1500,
  discountPercent: 20,
  images: ["https://cdn.shopify.com/...", ...],
  description: "<p>HTML string from Shopify</p>",
  status: "IN_STOCK",
  type: "APPAREL",
  options: [
    { name: "Size", values: ["S", "M", "L", "XL"] },
    { name: "Color", values: ["Black", "White"] }
  ],
  variants: [
    {
      id: "48123456789",
      title: "S / Black",
      price: 1200,
      compareAtPrice: 1500,
      discountPercent: 20,
      available: true,
      options: ["S", "Black"],      // positional, matches options array
      featured_image: "https://..." // variant-specific image, or null
    }
  ]
}
```

---

## `addToCart(variantId, quantity)` — Add to Shopify Cart

**Endpoint:** `POST /cart/add.js`  
**Used in:** `App.jsx → addToCart()`  
**Body:**
```json
{
  "items": [{ "id": 48123456789, "quantity": 1 }]
}
```

### Notes
- `variantId` is cast to `parseInt` before sending (Shopify requires a number, not a string)
- On success, also updates React's local `cartItems` state for immediate UI feedback
- Throws on failure — the caller in `App.jsx` catches and logs the error

---

## Checkout

**Endpoint:** `GET /checkout` (Shopify native)  
**Triggered by:** "Proceed to Checkout" button in `CartModal`  
**Method:** `window.location.href = '/checkout'`

Shopify reads its own server-side cart and takes over the checkout flow completely. No custom code is involved.

---

## Limitations & Known Issues

| Issue | Impact | Suggested Fix |
|-------|--------|---------------|
| No cart hydration on page refresh | React cart drawer is empty after refresh | Fetch `GET /cart.js` on App mount and seed `cartItems` state |
| Product list limited to 250 | `/products.json` returns max 250 products | Add pagination with `?limit=250&page=N` |
| No search API | No search functionality implemented | Add `GET /search?q={query}&type=product` |
| No collection filtering | All products from store appear | Add `GET /collections/{handle}/products.json` for filtered lists |
