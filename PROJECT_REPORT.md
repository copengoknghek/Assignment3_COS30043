# Chan - Women Fashion Shop Project Report

## Main Functionality

Chan is a Vue 3 women's fashion shopping application built with Vite and Bootstrap 5. It provides a fully responsive storefront with the following pages:

- **Home (`/`)** - Hero banner with live product count stats and a "You may also like" featured product block.
- **About (`/about`)** - Personal introduction form with first/last name inputs and a live greeting, plus radio buttons to switch between casual and party outfit preview images.
- **Products (`/products`)** - Full product listing with search by name, category filter dropdown, min/max price range filter, pagination (8 products per page), and like/add-to-cart actions.
- **Product Detail (`/product/:id`)** - Individual product page showing image, description, price, like count, and add-to-cart button.
- **Fashion API (`/fashion`)** - External API page that fetches women's fashion items from `dummyjson.com`, with search, category filter, and pagination (9 items per page). Falls back to a curated demo dataset if the network request fails.
- **Cart (`/cart`)** - Protected page listing cart items for the logged-in user, with quantity controls, item removal, and a running total.
- **Login / Register (`/login`)** - Single page toggling between login and register modes with client-side validation and error messages.
- **Admin (`/admin`)** - Protected, admin-only CRUD page for adding, editing, and deleting products via a form and a table view.
- **404 (`/:pathMatch(.*)`)** - Not-found fallback page.

## Technical Components and Tools Used

### Framework and Build
- **Vue 3** with the Composition API (`<script setup>`) for all views and components
- **Vite** for fast development server, hot module replacement, and optimised production builds
- **Vue Router 4** with `createWebHistory`, lazy-loaded route components, and a `beforeEach` navigation guard that enforces `requiresAuth` and `requiresAdmin` route meta flags

### State Management (Pinia)
Six dedicated stores manage all shared state:

| Store | Responsibility |
|---|---|
| `auth` | User registration, login, logout, email/password validation, localStorage persistence |
| `product` | Product list with CRUD operations, like toggling with per-user tracking, localStorage sync and default-data merge |
| `cart` | Per-user cart stored as a map keyed by email; add, update quantity, remove, clear; watched for automatic localStorage sync |
| `ui` | Dark/light theme toggle persisted to localStorage; applies `data-theme` attribute to `<html>` immediately on load |
| `notification` | Toast notification queue (success/info/error) consumed by `AppToast` |
| `effects` | `likeBurstTick` counter consumed by `GlobalLikeBurst` for the heart-burst animation |

### Components
- **`Navbar`** - Responsive Bootstrap navbar with theme-aware logo swap, live cart count badge, conditional admin link, greeting for the logged-in user, and logout button
- **`ProductList`** - Renders a responsive card grid, emitting `add` and `like` events upward
- **`ProductCard`** - Individual product card with image, name, price, category, like count, like toggle (heart icon), and add-to-cart button
- **`SearchBar`** - Search text input, category `<select>`, and min/max price inputs; uses `v-model`-compatible emit pattern
- **`CartItem`** - Single cart row with quantity input (min 1), remove button, and line total
- **`LoadingSpinner`** - Reusable spinner shown during async data loads
- **`AppToast`** - Bootstrap toast notification rendered from the `notification` store queue
- **`GlobalLikeBurst`** - Overlay heart-burst animation triggered via the `effects` store

### Vue Template Features Used

| Feature | Where used |
|---|---|
| `v-model` | Login/register form, admin product form, search/filter inputs, about name inputs, cart quantity |
| `v-for` | Product list, cart item list, admin table rows, category options, pagination buttons |
| `v-if` / `v-show` | Auth state checks, loading/empty states, register-only fields, outfit preview images, admin edit cancel button |
| `v-bind` | Dynamic `:src` for images/logos, `:class` for active pagination page, `:disabled` on buttons |
| `v-on` / `@` | Button clicks, form `@submit.prevent`, `@click` for pagination and like |
| `computed` | Filtered/paginated products, cart totals, unique API categories, greeting name, logo selection |
| Custom directive `v-focus` | Auto-focuses the Fashion API search input on mount |

### Data Persistence
All persistent data lives in `localStorage` under namespaced keys (`mini-shop-users`, `mini-shop-current-user`, `mini-shop-products`, `mini-shop-carts-by-user`, `mini-shop-theme`).

## Innovative Features and Unique Approaches

- **Theme-aware branding** - The navbar logo switches between a dark-background version (`chan.png`) and a light-background version (`chanlight.png`) whenever the theme toggles, using a `computed` property tied to the UI store.
- **Persistent dark mode** - The `ui` store applies `data-theme="dark"` to `<html>` immediately on startup via `watch({ immediate: true })`, preventing any flash of the wrong theme on reload.
- **Per-user cart isolation** - Cart data is stored as an object keyed by user email, so each account keeps its own independent cart across sessions.
- **Smart product seeding** - On startup, the product store merges the saved localStorage list with the latest seeded defaults, so any newly added default products appear automatically for returning users without wiping their custom additions.
- **Fashion API with graceful fallback** - The Fashion page filters live `dummyjson.com` data to women-relevant categories. If the fetch fails for any reason, a curated 12-item demo dataset is loaded silently, keeping all search, filter, and pagination features fully functional offline.
- **Admin-only route guard** - The admin route uses both `requiresAuth` and `requiresAdmin` meta flags; the router guard checks `isAdmin` (derived from a hardcoded admin email) and redirects non-admin users to the home page.
- **Reactive first/last name handling** - Registration, login session, navbar greeting, and the about page all use `firstName`/`lastName` fields separately, with computed display name assembly, rather than relying on a single combined string.
- **Like burst animation** - Liking a product triggers a global heart-burst overlay via the `effects` store, adding visual feedback decoupled from the product card itself.
- **Toast notification system** - A central `notification` store queues success/info/error messages consumed by the `AppToast` component, replacing `alert()` calls with non-blocking UI feedback.

## Challenges and How They Were Addressed

**localStorage product sync** - Adding new default products after a user had already saved their own product list would otherwise cause new defaults to be ignored. The product store resolves this by reading both lists on startup and prepending any missing default items to the saved array before writing it back.

**Consistent dark mode styling** - Bootstrap's default styles override CSS custom properties in many elements. Targeted `data-theme="dark"` CSS rules were added per-component (navbar links, cards, form controls, pagination, image containers) to maintain readable text and a balanced visual appearance in both themes.

**API reliability** - The Fashion API page depends on a live external endpoint. A `try/catch` in `loadFashionItems` silently swaps in the demo dataset on any fetch or parse error, ensuring the page always renders with working search and pagination.

**Per-user cart state** - Syncing the active cart when the logged-in user changes required watching `authStore.currentUser.email` in the Navbar and calling `cartStore.setActiveUser(email)` reactively, so the cart count and items always reflect the correct user without requiring a page reload.
