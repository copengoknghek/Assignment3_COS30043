# Chan - Women Fashion Shop Project Report

## Main Functionality

Chan is a Vue 3 women’s fashion shopping application built with Vite and Bootstrap. It provides a responsive storefront with a home page, about page, product listing, product details, cart, login and registration, and an admin CRUD page.

The app supports user registration and login with localStorage persistence, differentiated content for authenticated users, product search and filtering, product likes, cart management, and admin product management. It also includes a fashion-focused API page that displays women’s fashion items with search, category filtering, and pagination.

## Technical Components and Tools Used

- Vue 3 single-file components for all views and reusable UI pieces
- Vue Router for page navigation and route guarding
- Pinia for app-wide state management
- Vite for build tooling and fast development
- Bootstrap 5 grid system for responsive layout
- LocalStorage for persisting users, current session, products, cart data, and theme preference
- Custom directive `v-focus` for automatically focusing key input fields
- Computed properties, methods, `v-model`, `v-if`, `v-for`, `v-bind`, and `v-on` throughout the app

## Innovative Features and Unique Approaches

- Theme-aware branding with different Chan logos for light and dark mode
- Persistent dark mode with a pink/white light theme and pink/black dark theme
- Fashion API page using an external data source, plus a fallback dataset so the page remains usable if the network request fails
- Admin-only access restricted to a specific email address
- Reactive name handling that supports first name and last name separately across registration, login, navbar greeting, and the about page
- Pagination on both the product listing and the fashion API page

## Challenges and How They Were Addressed

One challenge was keeping localStorage data in sync when new default products were added. This was solved by merging the saved product list with the latest seeded data so newer items appear automatically for existing users.

Another challenge was styling the app consistently in dark mode. This required targeted CSS overrides for navbar links, cards, forms, pagination, and image containers so text remained readable and the UI stayed visually balanced.

The external API page also needed to stay reliable even when the API request failed. To address this, a fallback fashion dataset was added so the page still demonstrates search, filtering, and pagination without depending entirely on live network access.
