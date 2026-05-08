# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Vite dev server
- `npm run build` — production build (outputs to `dist/`)
- `npm run preview` — preview the production build

There is no test runner, linter, or type checker configured in this project.

## Architecture

Single-page React 18 + Vite app (a frontend-only e-commerce demo originally named "shopwave", branded "Nosej"). No backend — product data comes from the public DummyJSON API, augmented with a small set of hard-coded "Nosej" branded products. All user state (auth, cart, wishlist, theme) is persisted in `localStorage`.

### Routing & provider stack

`src/App.jsx` is the single source of truth for routes and provider order. Providers nest in this exact order (outer → inner): `ThemeProvider → ToastProvider → AuthProvider → CartProvider → WishlistProvider`. Inner providers may consume outer ones (e.g. Cart/Wishlist read auth state and emit toasts), so do not reorder casually.

`/checkout` and `/profile` are wrapped in `ProtectedRoute`; everything else is public. `ScrollToTop` and `ErrorBoundary` sit inside the router but outside `Routes`.

### Data layer

All network access is centralised in [src/services/api.js](src/services/api.js):
- `fetchProducts()` fans out to DummyJSON (`/products?limit=100` plus three men's category endpoints), de-duplicates by id, and **prepends** the local `NOSEJ_PRODUCTS` array so Nosej items appear first.
- `fetchProduct(id)` checks `NOSEJ_PRODUCTS` first (ids 9001–9006 range) before falling back to DummyJSON. New local products must be added to that array, otherwise a detail page will 404.
- `fetchCategories()` injects `"nosej"` and the men's categories into the returned list.

UI code never calls `fetch` directly — it goes through `useFetchProducts` / `useFetchProduct` hooks, which wrap the service functions with loading/error state.

### Contexts

Each context in `src/context/` follows the same pattern: a provider that hydrates initial state from `localStorage` (key prefix `shopwave-…`), exposes a custom hook (`useAuth`, `useCart`, `useWishlist`, `useToast`, `useTheme`) that throws if used outside its provider, and writes back to `localStorage` on changes. When adding state, follow this same pattern rather than introducing a new state library.

### Styling

Tailwind CSS v4 via the `@tailwindcss/vite` plugin (no `tailwind.config.js` — v4 uses CSS-based config in `src/styles/global.css`). MUI v6 (`@mui/material`, `@mui/icons-material`) is used alongside Tailwind for some components — both are intentional. Animations use `framer-motion`; the address picker on Checkout uses `react-leaflet` + `leaflet`.

### Deployment

Configured for Vercel via [vercel.json](vercel.json) and SPA fallback in `public/_redirects`. Client-side routing requires the catch-all rewrite — don't remove it.
