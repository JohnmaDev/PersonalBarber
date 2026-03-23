PersonalBarber - Beauty Hub & Barber Shop Management System
=========================================================

PersonalBarber is a full-stack, dual-aesthetic web platform designed to manage 
a hybrid barbershop and cosmetics boutique. It features a complete reservation 
system, an integrated e-commerce store, and a comprehensive administration panel.

The user interface dynamically switches between two distinct visual contexts:
- "Nuestra Tienda" (For Him): A brutalist, neon-green aesthetic.
- "Beauty Hub" (For Her): An elegant, rose-gold aesthetic.

Architecture
------------
The project is decoupled into two primary layers:

1. Frontend (front/):
   - Framework: Vue 3 (Composition API, Vue Router).
   - Styling: Tailwind CSS (Custom extensions for animations and themes).
   - Core Views: Landing Page, Dual-Gender Store, Reservation Flow, 
     Admin Dashboard, Dynamic Product Toggles (Boutique, Coming Soon).

2. Backend (backend/functions/):
   - Runtime: Go 1.25.5 (AWS Lambda signature, Netlify Functions environment).
   - Endpoints: Reservation management, Category CRUD, Product CRUD.
   - Database: MongoDB Atlas (via go.mongodb.org/mongo-driver/v2).
   - Security: Route-level PIN verification via environment variables.

Features
--------
- Real-time Reservation Engine: Slot calculation, overlap prevention, 
  and direct integration with Google Maps deep-linking.
- Dual-Aesthetic E-Commerce: Dynamic UI filtering and styling based on user 
  selection ("Men", "Women", "Unisex").
- Headless CMS (Admin Panel): Full CRUD operations for Products and Categories.
- Image Handling: Support for multiple product images (Gallery view) and 
  placeholder fallbacks.
- Webhook Automation: Sends operational alerts using Make.com hooks.

Requirements
------------
- Node.js (v18 or higher recommended)
- Go (1.21 or higher)
- Netlify CLI (For local API development and backend routing)
- A MongoDB Atlas Cluster (URI)

Installation & Initialization
-----------------------------
1. Environment Variables:
   Inside the `front/` directory, create a `.env.local` file with the following:
   
   VUE_APP_MAKE_WEBHOOK=your_make_webhook_url
   VUE_APP_ADMIN_PIN=your_secure_pin
   MONGODB_URI=your_mongodb_atlas_connection_string

2. Install Frontend Dependencies:
   $ cd front/
   $ npm install

3. Populate Database Categories:
   Run the initial category seeder to construct the 16-department layout.
   $ cd backend/functions/
   $ go run /tmp/seed_atlas.go "YOUR_MONGODB_URI"

4. Start Local Development:
   We recommend using the Netlify CLI to proxy the backend functions correctly.
   From the root of the project:
   $ netlify dev

   (Alternatively, if you only need frontend development without API resolution):
   $ cd front/
   $ npm run serve

Directory Structure
-------------------

```text
.
├── backend/                            # Go Serverless API
│   ├── functions/                      # Netlify Cloud Functions
│   │   ├── get_categories/             # Fetches shop categories
│   │   ├── get_products/               # Fetches active product list
│   │   ├── list_reservations/          # Admin reservation readout
│   │   ├── manage_categories/          # Create, Update, Delete categories
│   │   ├── manage_products/            # Create, Update, Delete products
│   │   ├── reserve/                    # Slot booking logic
│   │   └── seed_categories/            # Initial DB structural seed
│   ├── go.mod                          # Go module dependencies
│   └── go.sum                          
├── front/                              # Vue 3 Single Page Application
│   ├── public/                 
│   └── src/                    
│       ├── assets/                     # Tailwind directives and static files
│       ├── components/                 # Reusable Vue components (Hero, ShopCategories, etc.)
│       ├── composables/                # State management (useCart)
│       ├── router/                     # Application routes
│       ├── utils/                      # Formatting helpers
│       └── views/                      # Main route entrypoints (App, StoreView, AdminPanel)
├── netlify.toml                        # Server and build proxy routing instructions
└── README.md                           # This document
```

Security Notice
---------------
Ensure that the `MONGODB_URI` and `VUE_APP_ADMIN_PIN` are never committed to 
version control. The `.env.local` is git-ignored by default. Use server-side 
environment variables when deploying to production infrastructure.

License
-------
PersonalBarber is licensed under the MIT License.
Written by JohnmaDev.
