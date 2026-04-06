# Chan - Women Fashion Shop

Vue 3 + Vite women fashion e-commerce project for Assignment 3.

## Features Implemented

- Router pages:
	- `/` Home
	- `/products` Product list
	- `/product/:id` Product detail
	- `/cart` Cart (auth required)
	- `/login` Login/Register
	- `/admin` Product CRUD (auth required)
- Authentication with localStorage (register + login + logout)
- Product listing from JSON/localStorage
- Search and filter (name, category, price range)
- Like product with like counter (auth required)
- Cart system (add, remove, quantity, total)
- Admin CRUD (add, edit, delete product)
- Responsive layout using Bootstrap grid
- Stage 3 extension:
	- Dark mode toggle with persistent setting (localStorage)
	- Recommendation block: "You may also like"

## Technical Criteria Coverage

- `v-model`: login/register forms, admin form, filter controls
- `v-for`: product list, category options, cart list, admin rows
- `v-if`: auth state, loading/empty states
- `v-bind`: dynamic image, links, values
- `v-on`: button clicks, form submit, input handlers
- `computed`: filtered products, totals, recommendation list
- `methods`: add cart, like toggle, auth and CRUD actions

## Setup

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```
