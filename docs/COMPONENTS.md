# Component Reference

All React components live in `frontend/components/`. Each component has a matching `.css` file co-located next to it.

---

## `Navbar`
**File:** `frontend/components/Navbar.jsx` + `Navbar.css`

**Responsibilities:**
- Renders the black announcement bar at the top of every page
- Displays the DARTH brand name (center)
- Renders nav links (left) and action icons: Search, Account, Cart (right)
- Shows a cart item count badge on the bag icon
- Toggles a mobile hamburger menu on small screens

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `cartCount` | `number` | Total item count shown as badge on cart icon |
| `onOpenCart` | `function` | Called when user clicks the cart bag icon |

**CSS classes:** `.announcement-bar`, `.navbar`, `.navbar__inner`, `.navbar__brand`, `.navbar__nav`, `.navbar__actions`, `.navbar__mobile-toggle`, `.navbar__mobile-menu`

---

## `Hero`
**File:** `frontend/components/Hero.jsx` + `Hero.css`

**Responsibilities:**
- Renders a minimal collection header section (title + subtitle)
- Purely presentational — no props, no state

**Props:** None

**CSS classes:** `.collection-header`, `.collection-header__inner`, `.collection-title`, `.collection-subtitle`

---

## `ProductGrid`
**File:** `frontend/components/ProductGrid.jsx` + `ProductGrid.css`

**Responsibilities:**
- Renders a 4-column responsive product card grid (3 on tablet, 2 on mobile)
- Each card shows: primary image, secondary image on hover, sale badge, sold-out badge, product name, pricing with compare-at price and savings percentage
- Clicking a card navigates to `/product/:handle`
- Does NOT have an add-to-cart button (user goes to PDP first)

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `products` | `array` | Array of product objects from `fetchProducts()` in `shopify.js` |
| `onAddToCart` | `function` | Passed down but not currently used on grid — reserved for future quick-add |

**Product object shape:**
```js
{
  id: string,           // variant ID (string)
  handle: string,       // Shopify product handle for URL
  name: string,         // product title
  price: number,        // sale price in INR
  compareAtPrice: number | null,
  discountPercent: number | null,
  image: string,        // primary image URL
  secondaryImage: string, // second image URL (used on hover)
  images: string[],     // all image URLs
  status: 'IN_STOCK' | 'SOLD_OUT',
  hasVariants: boolean,
  colorCount: number,
  colorValues: string[]
}
```

**CSS classes:** `.products-section`, `.product-grid`, `.product-card`, `.product-card__link`, `.product-card__image-wrapper`, `.product-card__image--primary`, `.product-card__image--secondary`, `.product-card__badge--sale`, `.product-card__badge--soldout`, `.product-card__info`, `.product-card__title`, `.product-card__price`

---

## `ProductDetail`
**File:** `frontend/components/ProductDetail.jsx` + `ProductDetail.css`

**Responsibilities:**
- Full product detail page (PDP)
- Fetches product data using `handle` from `useParams()` → `fetchProduct(handle)`
- Manages: active image gallery, selected variant options, current variant (for price/availability)
- Shows: left thumbnail strip + main image, pricing with discounts, variant selectors (size, color etc.), Add to Cart button, product description (HTML), trust badges
- Scrolls to top on mount/handle change
- Navigates back to `/` on breadcrumb click or "Product not found" CTA

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `onAddToCart` | `function` | Called with `{ id, name, price, image, handle }` when user adds to cart |

**Internal state:**
| State | Type | Description |
|-------|------|-------------|
| `product` | `object \| null` | Fetched product data |
| `loading` | `boolean` | Shows spinner while fetching |
| `activeImage` | `string` | URL of currently displayed main image |
| `selectedOptions` | `object` | `{ option1: 'M', option2: 'Black', ... }` |
| `currentVariant` | `object \| null` | Matched variant from selected options |

**CSS classes:** `.pdp`, `.pdp-loading`, `.pdp-not-found`, `.pdp-breadcrumb`, `.pdp-layout`, `.pdp-gallery`, `.pdp-gallery__thumbs`, `.pdp-gallery__thumb--active`, `.pdp-gallery__main`, `.pdp-info`, `.pdp-info__title`, `.pdp-info__pricing`, `.pdp-option`, `.pdp-option__btn--active`, `.pdp-actions`, `.pdp-actions__atc`, `.pdp-description`, `.pdp-trust`

---

## `CartModal`
**File:** `frontend/components/CartModal.jsx` + `CartModal.css`

**Responsibilities:**
- Slide-in cart drawer from the right side of the screen
- Lists all cart items with image, name, price, quantity controls (+/-), and remove button
- Shows subtotal and a "Proceed to Checkout" button that navigates to `/checkout`
- Clicking the overlay closes the cart

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `isOpen` | `boolean` | Controls visibility |
| `onClose` | `function` | Called when overlay or X button is clicked |
| `items` | `array` | Cart items: `{ id, name, price, image, quantity }` |
| `onRemove` | `function(productId)` | Remove item from cart |
| `onUpdateQuantity` | `function(productId, newQty)` | Update item quantity |

**CSS classes:** `.cart-overlay`, `.cart-drawer`, `.cart-header`, `.cart-items`, `.cart-item`, `.cart-item__image`, `.cart-item__info`, `.cart-item__qty`, `.cart-footer`, `.cart-checkout-btn`

---

## `Footer`
**File:** `frontend/components/Footer.jsx` + `Footer.css`

**Responsibilities:**
- 4-column grid footer: Brand + social links | Quick Links | Customer Service | Contact
- Renders copyright notice at bottom
- Purely presentational — no props, no state

**Props:** None

**CSS classes:** `.site-footer`, `.footer-grid`, `.footer-col`, `.footer-logo`, `.footer-social`, `.footer-nav`, `.footer-bottom`
