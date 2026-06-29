# NextShop Monorepo

## Project Overview

This repository contains a full-stack e-commerce application with:

- `backend/` — Express API, MongoDB, JWT auth, Cloudinary uploads, Stripe integration.
- `letest/` — Next.js storefront with React, Tailwind CSS, Zustand, and React Query.

The project is structured as a monorepo with separate backend and frontend packages.

## Architecture

### Backend

- Entry point: `backend/index.js`
- Framework: `Express` (ES modules)
- Database: `MongoDB` via `mongoose`
- Auth: JWT-based sign-up and sign-in
- File upload: Cloudinary via `multer-storage-cloudinary`
- Payment: Stripe checkout integration
- CORS configured with `CLIENT_URL`

### Frontend

- App folder: `letest/app`
- Framework: `Next.js 16` with `React 19`
- Styling: `Tailwind CSS`
- State: `zustand` and React query
- API helpers: `letest/app/lib/api.js`
- Auth storage: `letest/app/lib/auth.js`
- Cart context: `letest/app/lib/cartContext.tsx`

## Backend Features

### Key endpoints

#### Auth
- `POST /api/auth/signup` — create account with `name`, `email`, `password`
- `POST /api/auth/signin` — login and receive JWT token

#### Products
- `GET /api/products` — public listing with filters, pagination, search
- `POST /api/products` — protected admin route to create a product with image upload
- `PUT /api/products/:id` — protected admin route to update product and optional image
- `DELETE /api/products/:id` — protected admin route to delete product

#### Shop listing
- `GET /api/products/shop` — shop-specific product listing with filters, search, pagination

#### Cart
- `GET /api/cart` — get current user cart
- `POST /api/cart/add` — add product to cart
- `POST /api/cart/remove` — remove product from cart
- `POST /api/cart/clear` — empty cart

#### Orders
- `POST /api/orders` — create order for authenticated user
- `GET /api/orders/mine` — authenticated user order history
- `GET /api/orders` — admin-only order list
- `PUT /api/orders/:id` — admin-only order status update

#### Categories
- `GET /api/categories` — list categories
- `POST /api/categories` — create a category (authenticated)

#### Todos
- `POST /api/todos/create` — create todo (authenticated)
- `GET /api/todos/get` — list user todos
- `PUT /api/todos/update/:id` — update user todo
- `DELETE /api/todos/delete/:id` — delete user todo

### Backend Models

- `backend/models/product.js`
  - `name`, `description`, `price`, `category`, `stock`, `image`, `images`, `featured`, `rating`
  - Full-text search index on `name` and `description`

- `backend/models/cart.js`
  - `userId`, `items` with `productId` and `quantity`

- `backend/models/order.js`
  - `user`, `items`, `total`, `shipping`, `status`

- `backend/models/auth.model.js`
  - `name`, `email`, `password`, `role`

- `backend/models/todo.model.js`
  - `title`, `description`, `completed`, `owner`

### Backend Middleware & Helpers

- `backend/middlewares/auth.middleware.js`
  - `protect()` validates Bearer JWT token
  - `adminOnly()` checks `req.user.role === 'admin'`

- `backend/middlewares/upload.js`
  - Cloudinary storage for product images
  - File size limit: 2MB

- `backend/lib/cloudinary.js`
  - Configures Cloudinary using env vars

- `backend/database/mongodb.js`
  - Connects via `DB_URL`
  - Logs warnings if database settings are missing

## Frontend Features

### Pages

- `letest/app/page.jsx` — landing hero page with sign in / sign up navigation
- `letest/app/shop/page.jsx` — shop page wrapper for product browsing
- `letest/app/product/[id]/page.jsx` — product detail page
- `letest/app/cart/page.jsx` — shopping cart page
- `letest/app/checkout/page.jsx` — checkout flow page (exists in app structure)
- `letest/app/signin/page.jsx` — login form
- `letest/app/signup/page.jsx` — registration form
- `letest/app/admin/*` — admin dashboard pages for products, inventory, orders, users

### Client utilities

- `letest/app/lib/api.js` — wrapper for `fetch` POST requests
- `letest/app/lib/auth.js` — token/user storage using `localStorage`
- `letest/app/lib/cartContext.tsx` — cart state provider and helpers
- `letest/app/providers.tsx` — React Query provider with devtools support

## Environment Variables

### Backend

Required variables for local development:

- `DB_URL` — MongoDB connection string
- `CLIENT_URL` — frontend URL allowed by CORS (for example `http://localhost:3000`)
- `JWT_SECRETE` — JWT signing secret
- `JWT_EXPIRE_IN` — token lifetime (e.g. `7d`)
- `CLOUDINARY_NAME` — Cloudinary cloud name
- `CLOUDINARY_KEY` — Cloudinary API key
- `CLOUDINARY_SECRET` — Cloudinary API secret
- `STRIPE_SECRET_KEY` — Stripe API key
- `PUBLIC_URL` — optional public base URL used for Stripe image references

The backend loads env files from:

- `backend/config/env.js`
- `.env.${NODE_ENV || 'development'}.local`

### Frontend

The frontend is a Next.js app and may need a matching API base URL configuration before deployment. Some pages currently fetch directly from a deployed backend hostname,
so update those references if you run locally.

## Local Setup

### Start backend

```bash
cd backend
npm install
npm run dev
```

### Start frontend

```bash
cd letest
npm install
npm run dev
```

Open the frontend at `http://localhost:3000` and the backend at `http://localhost:5000` by default.

## Useful Notes

- `backend/index.js` enables CORS, JSON body parsing, static `/uploads` routing, and compression.
- Admin-only product operations are enforced using `protect` and `adminOnly` middleware.
- Cart operations are tied to authenticated users and stored in MongoDB.
- The order flow stores orders in the backend and supports admin order status updates.
- The `todo` API is a separate authenticated feature for creating and managing user tasks.

## Project Structure

```
/ backend
  / config
  / controller
  / database
  / lib
  / middlewares
  / models
  / routes
/ letest
  / app
    / admin
    / cart
    / checkout
    / components
    / home
    / hook
    / lib
    / order
    / product
    / shop
    / signin
    / signup
  / public
```

## Known Inconsistencies

- The backend product model uses `name`, while some frontend pages reference `title`.
- The frontend `product/[id]/page.jsx` currently hardcodes a backend URL.

## Improvements & TODO

- unify backend and frontend product field names
- move API base URL to a shared environment config
- add more robust order/payment success handling
- add tests and validation for all routes
