# DARTH — Gothic Streetwear Shopify Theme

A custom Shopify theme built with **React + Vite + Liquid**, using `vite-plugin-shopify` for asset bundling.

## Prerequisites

- **Node.js** v18+ — [Download](https://nodejs.org/)
- **Shopify CLI** — Install with `npm install -g @shopify/cli`
- A **Shopify Partner account** with a development store

## Setup

```bash
# 1. Navigate to the darth theme directory
cd darth

# 2. Install dependencies
npm install
```

## Running in Development

You need **two terminals running simultaneously**:

### Terminal 1 — Vite Dev Server (React/JS bundling)

```bash
npm run dev
```

This starts Vite on `http://localhost:5173` to watch and hot-reload your React components under `frontend/`.

### Terminal 2 — Shopify Theme Dev (Liquid/theme syncing)

```bash
shopify theme dev
```

This syncs your Liquid templates to your Shopify development store and gives you a preview URL.

> **First time?** You'll be prompted to log in to your Shopify Partner account and select a development store. You can also specify it directly:
>
> ```bash
> shopify theme dev --store your-store-name.myshopify.com
> ```

### Preview Your Theme

Once both servers are running, Shopify CLI will output a local preview URL like:

```
http://127.0.0.1:9292
```

Open this URL in your browser to see the theme live with hot-reloading.

## Building for Production

```bash
npm run build
```

This compiles and minifies the React assets into the theme's `assets/` folder, ready for deployment.

## Deploying to Shopify

```bash
# Push the theme to your store
shopify theme push

# Or push to a specific store
shopify theme push --store your-store-name.myshopify.com
```

## Project Structure

```
darth/
├── config/                 # Shopify theme settings
│   └── settings_data.json
├── frontend/               # React source code (bundled by Vite)
│   ├── entrypoints/
│   │   └── main.jsx        # App entry point
│   ├── components/
│   │   ├── Navbar.jsx       # Navigation + announcement bar
│   │   ├── Hero.jsx         # Collection header
│   │   ├── ProductGrid.jsx  # Product listing grid
│   │   ├── ProductDetail.jsx# Product detail page
│   │   ├── CartModal.jsx    # Slide-out cart drawer
│   │   └── Footer.jsx       # Site footer
│   ├── utils/
│   │   └── shopify.js       # Shopify API helpers
│   ├── App.jsx              # Main app component
│   ├── App.css
│   └── index.css            # Global styles & design tokens
├── layout/
│   └── theme.liquid         # Main Liquid layout (loads React via vite-tag)
├── sections/                # Shopify sections
├── snippets/
│   └── vite-tag.liquid      # Vite asset loader snippet
├── templates/               # Shopify page templates
├── vite.config.js           # Vite configuration
└── package.json
```

## How It Works

1. `vite-plugin-shopify` bridges Vite and Shopify's asset system
2. In `layout/theme.liquid`, the line `{% render 'vite-tag' with 'main.jsx' %}` loads the React app
3. React mounts into `<div id="root">` and takes over the page rendering
4. Product data is fetched from Shopify's `/products.json` and `/products/{handle}.js` APIs
5. Cart operations use Shopify's `/cart/add.js` API, with checkout redirecting to `/checkout`

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React 19 | UI framework |
| React Router | Client-side routing |
| Vite 8 | Build tool + dev server |
| vite-plugin-shopify | Shopify theme integration |
| Lucide React | Icons |
| Liquid | Shopify templating |
