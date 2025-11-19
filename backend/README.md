# Express.js Backend API

This is the Express.js backend server for the Dream e-commerce application.

## Structure

```
backend/
├── server.ts              # Main Express server entry point
├── express-lib/           # Database and utility functions
│   └── db.ts             # Database helper functions
├── express-routes/        # API route handlers
│   ├── products.ts
│   ├── categories.ts
│   ├── colors.ts
│   ├── orders.ts
│   ├── auth.ts
│   ├── cart.ts
│   └── admin.ts
└── database/              # JSON database files
    ├── products.json
    ├── categories.json
    ├── colors.json
    ├── orders.json
    └── users.json
```

## Setup

1. Install dependencies:
```bash
pnpm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
cp backend/.env.example backend/.env
```

3. Start development server:
```bash
pnpm backend:dev
```

Or run both frontend and backend together:
```bash
pnpm dev:all
```

## API Endpoints

### Products
- `GET /api/products` - Get all products (with filtering, pagination)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Colors
- `GET /api/colors` - Get all colors
- `GET /api/colors/:id` - Get single color
- `POST /api/colors` - Create color
- `PUT /api/colors/:id` - Update color
- `DELETE /api/colors/:id` - Delete color

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Update order

### Auth
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Cart
- `GET /api/cart` - Get cart
- `POST /api/cart` - Add to cart
- `PUT /api/cart` - Update cart
- `DELETE /api/cart` - Remove from cart

### Admin
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/orders` - Get all orders (admin)
- `GET /api/admin/orders/recent` - Get recent orders
- `POST /api/admin/orders/:id/approve` - Approve order
- `POST /api/admin/orders/:id/reject` - Reject order
- `POST /api/admin/orders/:id/cancel` - Cancel order

## Database

The backend uses separate JSON files for each entity:
- `products.json` - All products
- `categories.json` - All categories
- `colors.json` - All colors
- `orders.json` - All orders
- `users.json` - All users

Each file is cached in memory for 5 minutes to improve performance.

## Development

The server runs on `http://localhost:5000` by default.

To change the port, set `BACKEND_PORT` in `.env` file.
