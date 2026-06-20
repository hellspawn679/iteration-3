# Styling Guide & Design System

All global design tokens are defined as CSS custom properties in `frontend/index.css`. All components use these tokens — never hardcode colors or spacing.

---

## Design Tokens (CSS Variables)

### Backgrounds
| Variable | Value | Usage |
|----------|-------|-------|
| `--bg-color` | `#ffffff` | Main page background |
| `--bg-dim` | `#f2f2f2` | Subtle section backgrounds |
| `--bg-light-dim` | `#fafafa` | Card hover backgrounds |
| `--bg-medium-dim` | `#f5f5f5` | Input backgrounds |

### Typography
| Variable | Value | Usage |
|----------|-------|-------|
| `--text-primary` | `#000000` | Body text, headings |
| `--text-secondary` | `#666666` | Subtitles, secondary info |
| `--text-muted` | `#999999` | Placeholders, hints |

### Borders
| Variable | Value | Usage |
|----------|-------|-------|
| `--border-color` | `#e8e8e1` | Card borders, dividers |
| `--border-light` | `rgba(0,0,0,0.08)` | Subtle separators |

### Accent & Buttons
| Variable | Value | Usage |
|----------|-------|-------|
| `--accent` | `#111111` | Primary button background |
| `--accent-light` | `#2b2b2b` | Button hover state |
| `--accent-text` | `#ffffff` | Text on dark buttons |

### Pricing
| Variable | Value | Usage |
|----------|-------|-------|
| `--price-color` | `#1c1d1d` | Regular price |
| `--price-sale` | `#ff4e4e` | Sale/discounted price |
| `--price-compare` | `#999999` | Strikethrough compare-at price |

### Component-Specific
| Variable | Value | Usage |
|----------|-------|-------|
| `--cart-dot` | `#ff4f33` | Cart badge dot color |
| `--announcement-bg` | `#000000` | Announcement bar background |
| `--announcement-text` | `#ffffff` | Announcement bar text |
| `--nav-bg` | `#ffffff` | Navbar background |
| `--footer-bg` | `#ffffff` | Footer background |
| `--drawer-bg` | `#ffffff` | Cart drawer background |

### Layout
| Variable | Value | Usage |
|----------|-------|-------|
| `--btn-radius` | `3px` | Border radius for all buttons |
| `--grid-gutter` | `17px` | Product grid gap |
| `--shadow-sm` | subtle | Small element shadows |
| `--shadow-md` | medium | Card hover shadows |
| `--shadow-lg` | large | Drawer/modal shadows |

---

## Typography

**Font:** `Inter` (Google Fonts) with system fallbacks:
```css
font-family: 'Inter', -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
```

**Base:** `14px`, `line-height: 1.6`, `letter-spacing: 0.025em`  
**Headings:** `font-weight: 400` (thin weight is intentional for the premium aesthetic)

---

## Utility Classes

### Buttons
```html
<!-- Primary: solid black, white text -->
<button class="btn-primary">Add to Cart</button>

<!-- Outline: bordered, transparent background -->
<button class="btn-outline">View All</button>
```

### Container
```html
<!-- Max-width 1400px, horizontally centered, 50px padding (15px on mobile) -->
<div class="container"> ... </div>
```

### Animations
```html
<div class="animate-fade-in">Fades in from below on mount</div>
<div class="animate-fade-in-up">Slides up and fades in</div>
```

Available `@keyframes`: `fadeIn`, `fadeInUp`, `slideInRight`, `slideOutRight`

---

## CSS Architecture & Conventions

- Each component has a co-located `.css` file (e.g., `Navbar.jsx` → `Navbar.css`)
- Class names follow **BEM-style** conventions: `.block__element--modifier`
  - Example: `.product-card__image--primary`, `.pdp-option__btn--active`
- Global base styles and resets are in `frontend/index.css`
- `App.css` contains only the `.app-container` wrapper style
- **No CSS modules, no Tailwind, no CSS-in-JS** — plain vanilla CSS throughout

### Responsive Breakpoints
| Breakpoint | Applies to |
|------------|-----------|
| `max-width: 1024px` | 3-column grid, some font size reductions |
| `max-width: 768px` | 2-column grid, mobile nav, stacked PDP layout |
| `max-width: 576px` | Single-column adjustments, reduced padding |

---

## Adding New Styles

1. If it's a component style, add it to that component's `.css` file.
2. If it's a shared/global utility, add it to `frontend/index.css`.
3. Always use existing CSS variables — do not hardcode colors.
4. Follow the existing BEM naming pattern for new class names.
