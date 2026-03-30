# PersonalBarber

![Vistas](https://hits.dwyl.com/JohnmaDev/PersonalBarber.svg?style=flat-square&color=39FF14)

Full-stack web platform for a barbershop in Medellin, Colombia. Includes an online reservation system, an e-commerce store with multi-department catalog, a gallery of completed work, and a comprehensive administration panel.

Built with Vue 3 on the frontend and Go serverless functions on the backend, deployed on Netlify with MongoDB Atlas as the database.

---

## Table of Contents

- [Architecture](#architecture)
- [Features](#features)
- [Directory Structure](#directory-structure)
- [Requirements](#requirements)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)
- [Deployment](#deployment)
- [Security](#security)
- [License](#license)

---

## Architecture

The project is split into two independent layers that communicate through a REST API proxied by Netlify:

### Frontend (`front/`)

- **Framework**: Vue 3 with Vue Router (SPA with client-side routing).
- **Styling**: Tailwind CSS with custom theme extensions (neon-green palette, Oswald typography, glass utilities).
- **State Management**: Reactive composables (`useCart.js`) for shared cart state across components.
- **Image Optimization**: Cloudinary dynamic transforms via `utils/image.js` (automatic format, quality, and width adjustment).
- **SEO**: Full Open Graph and Twitter Card meta tags, JSON-LD structured data (BarberShop schema), geo-targeting meta, and Google Search Console integration.

### Backend (`backend/`)

- **Language**: Go 1.21.
- **Runtime**: AWS Lambda-compatible handlers deployed as Netlify Functions.
- **Database**: MongoDB Atlas (via `go.mongodb.org/mongo-driver/v2`).
- **Security**: Admin endpoints protected by PIN verification with IP-based rate limiting and brute-force protection (temporary blocking after 5 failed attempts).

### How They Connect

The `netlify.toml` file proxies all `/api/*` requests to `/.netlify/functions/*`, so the frontend calls endpoints like `/api/get_products` which resolve to the corresponding Go function.

---

## Features

### Reservation System
- Visual calendar showing the next 14 days with horizontal scroll.
- Time slot grid with real-time availability checks against the database.
- Automatic detection of past time slots (blocks slots that have already passed today).
- Duplicate reservation prevention (409 Conflict response if the slot is taken).
- Direct WhatsApp link generation for client communication.

### E-Commerce Store
- Three-department catalog: "Para El" (men), "Para Ella" (women), and "Merch" (unisex).
- Category-based filtering with dynamic accent colors per department.
- Product detail page with image carousel, quantity selector, and stock validation.
- Shopping cart with persistent state across navigation (reactive composable).
- Checkout flow with WhatsApp order coordination (payment gateway integration prepared for Wompi).

### Performance & Optimization
- **Global API Cache**: Custom `useCatalog.js` composable that caches catalog and category data in memory, preventing redundant MongoDB queries during client-side navigation.
- **Asset Tree-Shaking**: Font Awesome SVG Core implementation that imports only strictly used icons, eliminating massive global CSS files and reducing build size.
- **Dynamic Assets**: Pre-generated WebP fallback images (`placeholder-product.webp` and `hero_barber.webp`) for robust SEO OpenGraph tags and graceful error handling.

### Gallery
- Masonry-style grid of completed haircuts loaded from the database.
- Cloudinary image optimization with lazy loading.

### Admin Panel
- PIN-protected access with session persistence.
- Full CRUD for products, categories, and gallery photos.
- Reservation viewer with upcoming/history separation and date grouping.
- Cloudinary upload widget integration for image management.
- Mobile-responsive interface.

---

## Directory Structure

```
.
├── backend/
│   ├── functions/                  # Netlify serverless functions (Go)
│   │   ├── get_categories/         # Public: returns all shop categories
│   │   ├── get_cuts/               # Public: returns gallery photos
│   │   ├── get_products/           # Public: returns product catalog
│   │   ├── get_slots/              # Public: returns booked time slots for a date
│   │   ├── list_reservations/      # Admin: returns all reservations (PIN required)
│   │   ├── manage_categories/      # Admin: create, update, delete categories
│   │   ├── manage_cuts/            # Admin: create, update, delete gallery photos
│   │   ├── manage_products/        # Admin: create, update, delete products
│   │   ├── reserve/                # Public: creates a new reservation
│   │   ├── seed_categories/        # Admin: initializes default category structure
│   │   └── seed_cuts/              # Admin: initializes sample gallery data
│   ├── pkg/
│   │   └── auth/                   # Shared authentication and rate-limiting logic
│   ├── go.mod
│   └── go.sum
├── front/
│   ├── public/
│   │   ├── icons/                  # Category icon assets (SVG, WebP)
│   │   ├── index.html              # Entry HTML with SEO meta, JSON-LD, font loading
│   │   ├── robots.txt
│   │   └── sitemap.xml
│   └── src/
│       ├── assets/                 # Background images, Tailwind base styles
│       ├── components/
│       │   ├── admin/              # Modularized Admin dashboard pieces
│       │   │   ├── AdminCategories.vue
│       │   │   ├── AdminCuts.vue
│       │   │   ├── AdminProducts.vue
│       │   │   └── AdminReservations.vue
│       │   ├── CartDrawer.vue      # Sliding cart panel
│       │   ├── CartIcon.vue        # Floating cart button with badge
│       │   ├── HeroSection.vue     # Landing page hero with profile card
│       │   ├── MasonryGallery.vue  # Haircut gallery grid
│       │   ├── ShopCategories.vue  # Category cards on the landing page
│       │   └── icons/              # Logo component (P_rose.vue) and SVG assets
│       ├── composables/
│       │   ├── useCart.js          # Global reactive cart state
│       │   └── useCatalog.js       # Global API cache for layout data
│       ├── router/
│       │   └── index.js            # Route definitions with lazy loading
│       ├── utils/
│       │   ├── format.js           # Price formatting (COP currency)
│       │   └── image.js            # Cloudinary URL optimization
│       ├── views/
│       │   ├── AdminPanel.vue      # Full admin dashboard
│       │   ├── CheckoutView.vue    # Order summary and payment
│       │   ├── Home.vue            # Landing page composition
│       │   ├── ProductDetailView.vue  # Single product page
│       │   ├── ReservaCita.vue     # Appointment booking flow
│       │   └── StoreView.vue       # Product catalog with filters
│       ├── App.vue                 # Root component with cart and scroll-to-top
│       └── main.js                 # Application entry point
├── netlify.toml                    # Build config, headers, and API proxy rules
├── .gitignore
└── README.md
```

---

## Requirements

- **Node.js** v18 or higher
- **Go** 1.21 or higher
- **Netlify CLI** (for local development with function proxying)
- **MongoDB Atlas** cluster with a connection URI

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/JohnmaDev/PersonalBarber.git
cd PersonalBarber
```

2. Install frontend dependencies:

```bash
cd front
npm install
```

3. Create your environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and set your `VUE_APP_ADMIN_PIN`.

4. Configure Netlify environment variables (see [Environment Variables](#environment-variables)).

5. Seed the database with initial categories (one-time operation):

Open your browser and navigate to:
```
https://your-site.netlify.app/api/seed_categories?token=YOUR_ADMIN_PIN
```

---

## Environment Variables

### Frontend (`front/.env.local`)

| Variable | Description |
|----------|-------------|
| `VUE_APP_ADMIN_PIN` | PIN required to access the admin panel. Must match the server-side value. |

### Backend (configured in Netlify dashboard under Site Settings > Environment Variables)

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB Atlas connection string. |
| `VUE_APP_ADMIN_PIN` | Admin PIN used for server-side verification of protected endpoints. |

---

## Running Locally

The recommended way to run locally is with the Netlify CLI, which correctly proxies API calls to the Go functions:

```bash
netlify dev
```

If you only need to work on the frontend without backend API access:

```bash
cd front
npm run serve
```

Note: API endpoints will not resolve without Netlify CLI or a deployed backend.

---

## Deployment

The project deploys automatically through Netlify. The `netlify.toml` configures:

- **Build command**: `cd front && npm install && npm run build`
- **Publish directory**: `front/dist`
- **Functions directory**: `backend/functions`
- **Go version**: 1.21

Each subdirectory inside `backend/functions/` is automatically compiled and deployed as an independent serverless function.

---

## Security

- The `MONGODB_URI` and `VUE_APP_ADMIN_PIN` must never be committed to version control. The `.env.local` file is git-ignored by default.
- Admin endpoints (`list_reservations`, `manage_products`, `manage_categories`, `manage_cuts`, `seed_*`) require the admin PIN via query parameter or Authorization header.
- The `pkg/auth` package implements IP-based rate limiting: after 5 failed authentication attempts, the IP is temporarily blocked for 30 minutes with a tarpit delay (3-5 second response slowdown to discourage automated attacks).
- Security headers (X-Frame-Options, X-Content-Type-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy) are set globally via `netlify.toml`.

---

## License

PersonalBarber is licensed under the MIT License.

Written by [JohnmaDev](https://www.linkedin.com/in/john-mario-echavarria-bermudez/).
