<div align="center">

<br/>

```
███████╗██╗███████╗███████╗ █████╗ 
██╔════╝██║██╔════╝██╔════╝██╔══██╗
█████╗  ██║███████╗███████╗███████║
██╔══╝  ██║╚════██║╚════██║██╔══██║
███████╗██║███████║███████║██║  ██║
╚══════╝╚═╝╚══════╝╚══════╝╚═╝  ╚═╝
```

**A full-stack luxury e-commerce platform built with React, Node.js, MongoDB, Redis & Stripe.**

<br/>

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Redis](https://img.shields.io/badge/Redis-7-DC382D?style=flat-square&logo=redis&logoColor=white)](https://redis.io)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=flat-square&logo=stripe&logoColor=white)](https://stripe.com)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)](https://docker.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

<br/>

![Eissa Ecommerce Hero](./frontend/public/Hero.jpeg)
---
![Eissa Ecommerce signin page](./frontend/public/signin.jpeg)

</div>

---

## Table of Contents

- [](#)
- [Table of Contents](#table-of-contents)
- [🛍️ Overview](#️-overview)
- [✨ Features](#-features)
  - [Storefront](#storefront)
  - [Authentication](#authentication)
  - [Checkout \& Payments](#checkout--payments)
  - [Performance](#performance)
  - [Infrastructure](#infrastructure)
- [🛠️ Tech Stack](#️-tech-stack)
  - [Frontend](#frontend)
  - [Backend](#backend)
  - [Infrastructure](#infrastructure-1)
- [🏗️ Architecture](#️-architecture)
- [📁 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Local Development](#local-development)
  - [Docker Setup](#docker-setup)
- [🔑 Environment Variables](#-environment-variables)
- [📡 API Reference](#-api-reference)
  - [Auth — `/api/auth`](#auth--apiauth)
  - [Products — `/api/products`](#products--apiproducts)
  - [Cart — `/api/cart`](#cart--apicart)
  - [Payment — `/api/payment`](#payment--apipayment)
  - [Health — `/api/health`](#health--apihealth)
- [📱 Frontend Pages](#-frontend-pages)
- [🗃️ State Management](#️-state-management)
- [🗄️ Database Schema](#️-database-schema)
  - [User](#user)
  - [Product](#product)
  - [Order](#order)
  - [Coupon](#coupon)
- [🔐 Authentication Flow](#-authentication-flow)
- [💳 Payment Flow](#-payment-flow)
- [🚢 Deployment](#-deployment)
  - [Docker (Recommended)](#docker-recommended)
  - [Environment Checklist for Production](#environment-checklist-for-production)
- [📜 Scripts](#-scripts)
  - [Backend](#backend-1)
  - [Frontend](#frontend-1)
  - [Docker](#docker)

---

## 🛍️ Overview

**Eissa** is a production-ready luxury fashion e-commerce application. It features a complete shopping experience — from browsing paginated product collections and filtering by category, through to a Stripe-hosted checkout, order creation, and post-purchase confirmation. The design system follows a warm stone/neutral palette with Cormorant Garamond serif headings, creating a refined, editorial aesthetic.

---

## ✨ Features

### Storefront
- 🏠 **Home page** — animated hero, scrolling marquee, category grid, featured products, editorial split panels
- 🗂️ **Product catalogue** — paginated grid with URL-driven page state (`?page=N`)
- 🔍 **Category filtering** — dedicated pages per category with independent pagination
- 📄 **Product detail** — image gallery, accordion details, recommended products
- 🛒 **Cart drawer** — slide-in panel with quantity controls, free-shipping progress bar, real-time totals

### Authentication
- 🔐 **JWT authentication** — 15-minute access tokens + 7-day refresh tokens
- 🍪 **httpOnly cookies** — XSS-safe token storage, automatic silent refresh via Axios interceptor
- 🗄️ **Redis session store** — refresh tokens stored and invalidated server-side

### Checkout & Payments
- 💳 **Stripe hosted checkout** — PCI-compliant, no card data touches your server
- 🎟️ **Coupon codes** — percentage-discount coupons with per-user, single-use enforcement
- 🎁 **Auto-generated coupons** — orders over $200 automatically generate a new 10% gift coupon
- ✅ **Order confirmation** — webhook-style success endpoint creates orders and deactivates used coupons

### Performance
- ⚡ **Redis caching** — featured products cached to avoid repeated DB queries
- 📦 **Pagination** — server-side `skip/limit` with parallel count queries
- 🖼️ **Cloudinary** — image hosting and optimisation for product photos
- 🦴 **Skeleton loaders** — 12 shimmer skeleton components matching every loading state

### Infrastructure
- 🐳 **Docker Compose** — one command spins up frontend, backend, MongoDB, and Redis
- 🏥 **Health checks** — all services have Docker healthchecks with dependency ordering
- 🔒 **Nginx reverse proxy** — serves the SPA and proxies `/api/*` to the backend
- 🌱 **Seed script** — 48 luxury mockup products across 6 categories, ready to run

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite 5 | Build tool & dev server |
| TypeScript | Type safety |
| Tailwind CSS 3 | Utility-first styling |
| shadcn/ui | Accessible component primitives |
| Zustand | Global state management |
| React Router v6 | Client-side routing |
| Axios | HTTP client with interceptors |
| @stripe/stripe-js | Stripe redirect |
| Lucide React | Icon library |

### Backend
| Technology | Purpose |
|---|---|
| Node.js 20 | Runtime |
| Express 4 | HTTP framework |
| MongoDB 7 | Primary database |
| Mongoose | ODM |
| Redis 7 | Token store & caching |
| ioredis | Redis client |
| JSON Web Tokens | Authentication |
| bcryptjs | Password hashing |
| Stripe Node SDK | Payment processing |
| Cloudinary SDK | Image hosting |
| dotenv | Environment config |

### Infrastructure
| Technology | Purpose |
|---|---|
| Docker & Compose | Containerisation |
| Nginx 1.27 | Reverse proxy & static serving |
| GitHub Actions | CI/CD (optional) |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                     Browser                         │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP :80
┌──────────────────────▼──────────────────────────────┐
│              Nginx (Docker)                         │
│  /           → Serve React SPA (dist/)              │
│  /api/*      → Proxy to backend:5000                │
└──────────┬───────────────────────────────┬──────────┘
           │ Static files                  │ /api/*
           │                  ┌────────────▼───────────┐
           │                  │  Express API :5000     │
           │                  │  ┌─────────────────┐   │
           │                  │  │  Auth Middleware │   │
           │                  │  │  (JWT + Cookie)  │   │
           │                  │  └────────┬────────┘   │
           │                  │           │             │
           │                  │  ┌────────▼────────┐   │
           │                  │  │   Controllers   │   │
           │                  │  │ auth │ products │   │
           │                  │  │ cart │ payment  │   │
           │                  │  └──┬───────────┬──┘   │
           │                  └─────┼───────────┼──────┘
           │                        │           │
    ┌──────▼──────┐      ┌──────────▼──┐  ┌────▼────────┐
    │  React SPA  │      │  MongoDB 7  │  │  Redis 7    │
    │  (Vite)     │      │  (Mongoose) │  │  Token Store│
    └─────────────┘      └─────────────┘  │  + Cache    │
                                          └─────────────┘
```

---

## 📁 Project Structure

```
Eissa/
│
├── docker-compose.yml
├── .env.example
│
├── frontend/                          # React / Vite
│   ├── frontend.Dockerfile
│   ├── nginx.conf
│   ├── .dockerignore
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   │
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       │
│       ├── pages/
│       │   ├── HomePage.tsx
│       │   ├── ProductsPage.tsx        # AllProductsPage + CategoryPage
│       │   ├── ProductDetailPage.tsx
│       │   ├── SignInPage.tsx
│       │   ├── SignUpPage.tsx
│       │   ├── CheckoutPage.tsx
│       │   ├── PurchaseSuccessPage.tsx
│       │   └── PurchaseCancelPage.tsx
│       │
│       ├── components/
│       │   ├── Navbar.tsx
│       │   ├── Footer.tsx
│       │   ├── CartDrawer.tsx
│       │   ├── AddToCartButton.tsx
│       │   ├── PaginationBar.tsx
│       │   └── Skeletons.tsx
│       │
│       └── stores/                     # Zustand stores
│           ├── useAuthStore.ts          # auth + shared axios instance
│           ├── useCartStore.ts
│           ├── useProductStore.ts
│           └── usePaymentStore.ts
│
└── backend/                           # Node.js / Express
    ├── backend.Dockerfile
    ├── .dockerignore
    ├── server.js
    ├── seed.js                        # Database seeder
    │
    ├── config/
    │   ├── db.js                      # MongoDB connection
    │   ├── redis.js                   # Redis client
    │   └── stripe.js                  # Stripe SDK init
    │
    ├── models/
    │   ├── user.model.js
    │   ├── product.model.js
    │   ├── order.model.js
    │   └── coupon.model.js
    │
    ├── controllers/
    │   ├── auth.controller.js
    │   ├── product.controller.js
    │   ├── cart.controller.js
    │   └── payment.controller.js
    │
    ├── routes/
    │   ├── auth.route.js
    │   ├── product.route.js
    │   ├── cart.route.js
    │   ├── payment.route.js
    │   └── health.route.js
    │
    └── middleware/
        └── auth.middleware.js          # JWT verification
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) ≥ 20
- [Docker](https://docker.com) & Docker Compose (for containerised setup)
- [MongoDB](https://mongodb.com) (local or Atlas, if not using Docker)
- [Redis](https://redis.io) (local or cloud, if not using Docker)
- A [Stripe](https://stripe.com) account (test keys work fine)
- A [Cloudinary](https://cloudinary.com) account (free tier is sufficient)

---

### Local Development

**1. Clone the repository**
```bash
git https://github.com/mohammedeissa7/Ecommerce
cd Eissa
```

**2. Set up environment variables**
```bash
cp .env.example .env
# Open .env and fill in your secrets (see Environment Variables section)
```

**3. Install & run the backend**
```bash
cd backend
npm install
npm run dev          # starts with nodemon on port 5000
```

**4. Install & run the frontend**
```bash
cd frontend
npm install
npm run dev          # starts Vite dev server on port 5173
```

**5. Seed the database**
```bash
cd backend
node seed.js         # inserts 48 luxury mockup products
node seed.js --fresh # drops existing products first
node seed.js --clear # only clears the collection
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

### Docker Setup

The fastest way to get everything running — one command spins up all 4 services.

```bash
# 1. Copy and fill in your .env
cp .env.example .env

# 2. Build and start all services
docker compose up --build

# 3. Seed the database (in a separate terminal)
docker compose exec backend node seed.js

# 4. Open the app
open http://localhost
```

**Stop everything**
```bash
docker compose down
```

**Stop and remove all data volumes**
```bash
docker compose down -v
```

**View logs**
```bash
docker compose logs -f              # all services
docker compose logs -f backend      # backend only
docker compose logs -f mongo        # mongo only
```

---

## 🔑 Environment Variables

Create a `.env` file in the project root (copy from `.env.example`):

```env
# App
NODE_ENV=production

# URLs
CLIENT_URL=http://localhost
VITE_API_URL=/api

# Database
MONGO_DB_NAME=Eissa

# Auth — generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
ACCESS_TOKEN_SECRET=your_64_char_random_secret
REFRESH_TOKEN_SECRET=your_other_64_char_random_secret

# Stripe — dashboard.stripe.com → Developers → API Keys
STRIPE_SECRET_KEY=sk_test_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Cloudinary — cloudinary.com → Dashboard
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

> ⚠️ **Never commit your `.env` file.** It is already in `.gitignore`.

---

## 📡 API Reference

All endpoints are prefixed with `/api`. Protected routes require a valid `accessToken` cookie.

### Auth — `/api/auth`

| Method | Endpoint | Auth | Body | Description |
|---|---|---|---|---|
| `POST` | `/signup` | ❌ | `{ name, email, password }` | Register new user |
| `POST` | `/login` | ❌ | `{ email, password }` | Sign in, sets cookies |
| `POST` | `/logout` | ✅ | — | Clears cookies, deletes Redis token |
| `POST` | `/refresh-token` | ❌ | — | Issues new access token from refresh cookie |

### Products — `/api/products`

| Method | Endpoint | Auth | Query | Description |
|---|---|---|---|---|
| `GET` | `/` | ❌ | `?page=1&limit=12` | Paginated product list |
| `GET` | `/featured` | ❌ | — | Featured products (Redis cached) |
| `GET` | `/recommended` | ❌ | — | 5 random products |
| `GET` | `/:id` | ❌ | — | Single product by ID |
| `GET` | `/category/:category` | ❌ | `?page=1&limit=12` | Paginated by category |
| `POST` | `/` | ✅ Admin | `{ name, description, price, image, category }` | Create product |
| `DELETE` | `/:id` | ✅ Admin | — | Delete product + Cloudinary image |
| `PATCH` | `/:id/toggle-featured` | ✅ Admin | — | Toggle featured flag |

### Cart — `/api/cart`

| Method | Endpoint | Auth | Body | Description |
|---|---|---|---|---|
| `GET` | `/` | ✅ | — | Get cart with full product details |
| `POST` | `/` | ✅ | `{ productId }` | Add item (increments if exists) |
| `DELETE` | `/` | ✅ | `{ productId? }` | Remove item or clear all |
| `PUT` | `/:id` | ✅ | `{ quantity }` | Update quantity (0 = remove) |

### Payment — `/api/payment`

| Method | Endpoint | Auth | Body | Description |
|---|---|---|---|---|
| `POST` | `/create-checkout-session` | ✅ | `{ products, couponCode? }` | Create Stripe session, returns `{ id, totalAmount }` |
| `POST` | `/checkout-success` | ✅ | `{ sessionId }` | Verify payment, create order, deactivate coupon |

### Health — `/api/health`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/` | ❌ | Returns MongoDB & Redis status. Used by Docker healthcheck |

---

## 📱 Frontend Pages

| Route | Component | Description |
|---|---|---|
| `/` | `HomePage` | Hero, marquee, categories, featured, editorial |
| `/products` | `AllProductsPage` | Paginated product grid |
| `/products/category/:category` | `CategoryPage` | Category-filtered grid |
| `/products/:id` | `ProductDetailPage` | Detail view + recommended |
| `/signin` | `SignInPage` | Login form |
| `/signup` | `SignUpPage` | Registration form |
| `/checkout` | `CheckoutPage` | Order review + coupon + Stripe redirect |
| `/purchase-success` | `PurchaseSuccessPage` | Post-payment confirmation |
| `/purchase-cancel` | `PurchaseCancelPage` | Cancelled payment recovery |

---

## 🗃️ State Management

Eissa uses **Zustand** for all global state with `persist` middleware where appropriate.

```
stores/
├── useAuthStore.ts     — user, isAuthenticated, signIn, signUp, signOut
│                         + shared axios instance (withCredentials, 401 interceptor)
├── useCartStore.ts     — items, drawer open state, CRUD actions, totalItems(), totalPrice()
├── useProductStore.ts  — products, pagination, featured, recommended, fetch actions
└── usePaymentStore.ts  — session, order, couponCode, createCheckoutSession, confirmCheckoutSuccess
```

**Axios interceptor** in `useAuthStore` silently calls `/auth/refresh-token` on 401 responses and retries the original request — access token expiry is completely transparent to the user.

---

## 🗄️ Database Schema

### User
```js
{
  name      : String,           // required
  email     : String,           // required, unique
  password  : String,           // bcrypt hashed
  role      : String,           // "customer" | "admin"
  cartItems : [{ productId, quantity }]
}
```

### Product
```js
{
  name        : String,         // required
  description : String,         // required
  price       : Number,         // required
  image       : String,         // Cloudinary URL
  category    : String,         // tops | bottoms | dresses | outerwear | accessories | footwear
  isFeatured  : Boolean         // Redis cached when true
}
```

### Order
```js
{
  user            : ObjectId → User,
  products        : [{ product: ObjectId, quantity, price }],
  totalAmount     : Number,
  stripeSessionId : String,     // unique
  timestamps      : true
}
```

### Coupon
```js
{
  code               : String,  // e.g. "GIFT3XK9A2"
  discountPercentage : Number,
  expirationDate     : Date,
  isActive           : Boolean,
  userId             : ObjectId → User
}
```

---

## 🔐 Authentication Flow

```
Sign Up / Sign In
      │
      ▼
  Express validates credentials
      │
      ▼
  generateToken(userId)
  ├── accessToken  → JWT, 15 min,  signed with ACCESS_TOKEN_SECRET
  └── refreshToken → JWT, 7 days,  signed with REFRESH_TOKEN_SECRET
      │
      ▼
  storeRefreshToken()  →  Redis SET refresh_token:{userId}  EX 7days
      │
      ▼
  setCookies()  →  httpOnly cookies set on response
      │
      ▼
  Client stores user object in Zustand (persisted to localStorage)
  Tokens live in httpOnly cookies only — never in JS memory

Silent Refresh (Axios interceptor)
  Any 401 response
      │
      ▼
  POST /auth/refresh-token
      │
      ▼
  Backend reads refreshToken cookie
  Verifies JWT + checks Redis match
      │
      ▼
  Issues new accessToken cookie
  Retries original request
```

---

## 💳 Payment Flow

```
CheckoutPage
      │
      ▼
  POST /api/payment/create-checkout-session
  Body: { products: [...], couponCode? }
      │
      ▼
  Backend:
  ├── Validates coupon (Coupon model, isActive, userId match)
  ├── Builds Stripe line_items from products
  ├── Creates stripe.checkout.sessions with:
  │   ├── success_url: CLIENT_URL/purchase-success?session_id={CHECKOUT_SESSION_ID}
  │   └── cancel_url:  CLIENT_URL/purchase-cancel
  └── Returns { id: session.id, totalAmount }
      │
      ▼
  Frontend: window.location.href = https://checkout.stripe.com/pay/{session.id}
      │
      ▼
  User completes payment on Stripe-hosted page
      │
      ├── Success → /purchase-success?session_id=cs_...
      │               │
      │               ▼
      │           POST /api/payment/checkout-success
      │           ├── stripe.checkout.sessions.retrieve(sessionId)
      │           ├── Deactivates used coupon
      │           ├── Creates Order document
      │           └── Returns { success, orderId }
      │
      └── Cancel → /purchase-cancel (cart preserved, no charge)
```

---

## 🚢 Deployment

### Docker (Recommended)

The `docker-compose.yml` is production-ready. For a cloud VM (DigitalOcean, AWS EC2, etc.):

```bash
# On your server
git clone https://github.com/mohammedeissa7/Ecommerce
cd Eissa
cp .env.example .env
nano .env                          # fill in production secrets

docker compose up --build -d       # start detached
docker compose exec backend node seed.js   # seed once
```

### Environment Checklist for Production
- [ ] `NODE_ENV=production`
- [ ] `CLIENT_URL` set to your real domain 
- [ ] `VITE_API_URL=/api` (same-origin via Nginx — no change needed)
- [ ] Stripe **live** keys (`sk_live_...` / `pk_live_...`)
- [ ] Strong `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET` (64+ chars)
- [ ] Remove exposed ports in `docker-compose.yml` (`5000`, `27017`, `6379`) — only `80` should be public
- [ ] Add an SSL certificate (use [Certbot](https://certbot.eff.org) + Nginx or a load balancer)

---

## 📜 Scripts

### Backend
```bash
npm run dev          # nodemon dev server
npm start            # production server
```

### Frontend
```bash
npm run dev          # Vite dev server (port 5173)
npm run build        # production build → dist/    # ESLint
```

### Docker
```bash
docker compose up --build          # build + start
docker compose up --build -d       # detached
docker compose down                # stop
docker compose down -v             # stop + delete volumes
docker compose logs -f [service]   # stream logs
docker compose exec backend sh     # shell into backend
docker compose exec mongo mongosh  # MongoDB shell
```



---


<div align="center">

Built with ❤️ by **Eissa**

<br/>

*Eissa — Dressed in Silence.*

</div>
