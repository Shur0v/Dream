# E-Commerce Backend Documentation

## Overview

This document provides a comprehensive guide to the e-commerce backend built with Next.js Server-Side Rendering (SSR) and TypeScript. The backend supports both admin panel and client site functionalities with a modular, organized structure.

## Table of Contents

1. [Backend Architecture](#backend-architecture)
2. [API Structure](#api-structure)
3. [Admin Panel APIs](#admin-panel-apis)
4. [Client Site APIs](#client-site-apis)
5. [Data Models](#data-models)
6. [Input Fields and Processing](#input-fields-and-processing)
7. [File Organization](#file-organization)
8. [Usage Examples](#usage-examples)

---

## Backend Architecture

The backend is built using Next.js 15 App Router with TypeScript, utilizing:
- **Server-Side Rendering (SSR)**: All API routes are server-side rendered
- **TypeScript**: Full type safety across all endpoints
- **Modular Structure**: Organized in a single `src/app/api` directory
- **RESTful Design**: Standard HTTP methods (GET, POST, PUT, DELETE)

### Directory Structure

```
src/app/api/
├── admin/
│   ├── dashboard/
│   │   └── route.ts          # Dashboard statistics
│   └── orders/
│       ├── route.ts          # List all orders
│       ├── recent/
│       │   └── route.ts      # Recent orders
│       └── [id]/
│           ├── approve/
│           │   └── route.ts # Approve order
│           ├── reject/
│           │   └── route.ts # Reject order
│           └── cancel/
│               └── route.ts # Cancel order
├── categories/
│   ├── route.ts              # List/Create categories
│   └── [id]/
│       └── route.ts         # Get/Update/Delete category
├── colors/
│   ├── route.ts              # List/Create colors
│   └── [id]/
│       └── route.ts         # Get/Update/Delete color
└── products/
    ├── route.ts              # List/Create products
    └── [id]/
        └── route.ts          # Get/Update/Delete product
```

---

## API Structure

### Base URL
All APIs are accessible at: `/api/{resource}`

### Response Format
All APIs return a consistent response format:

```typescript
{
  success: boolean;
  data: T;              // Response data
  message?: string;    // Success message
  error?: string;      // Error message (if success is false)
  pagination?: {       // Pagination info (for list endpoints)
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  }
}
```

### Error Handling
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (authentication required)
- **404**: Not Found (resource doesn't exist)
- **500**: Internal Server Error

---

## Admin Panel APIs

### 1. Dashboard API

**Endpoint**: `GET /api/admin/dashboard`

**Description**: Returns comprehensive dashboard statistics including revenue, product counts, order counts, and recent orders.

**Query Parameters**:
- `period` (optional): Filter revenue by period (`all`, `today`, `week`, `month`, `year`)
- `status` (optional): Filter recent orders by status

**Response**:
```typescript
{
  success: true,
  data: {
    totalRevenue: number;
    totalProducts: number;
    totalOrders: number;
    pendingOrders: number;
    recentOrders: Order[];
    revenueByPeriod?: Array<{
      period: string;
      revenue: number;
    }>;
  }
}
```

**Example Request**:
```bash
GET /api/admin/dashboard?period=month&status=pending
```

---

### 2. Orders Management API

#### List All Orders
**Endpoint**: `GET /api/admin/orders`

**Query Parameters**:
- `page` (default: 1): Page number
- `limit` (default: 20): Items per page
- `status`: Filter by order status
- `search`: Search in order ID, user ID, or product names
- `startDate`: Filter orders from this date
- `endDate`: Filter orders until this date
- `sortBy` (default: `createdAt`): Sort field (`totalAmount`, `status`, `createdAt`)
- `sortOrder` (default: `desc`): Sort direction (`asc`, `desc`)

**Example Request**:
```bash
GET /api/admin/orders?page=1&limit=20&status=pending&sortBy=createdAt&sortOrder=desc
```

#### Recent Orders
**Endpoint**: `GET /api/admin/orders/recent`

**Query Parameters**:
- `limit` (default: 10): Number of recent orders
- `status` (optional): Filter by status

**Example Request**:
```bash
GET /api/admin/orders/recent?limit=10&status=pending
```

#### Approve Order
**Endpoint**: `POST /api/admin/orders/{id}/approve`

**Description**: Approves a pending or confirmed order, changing status to `approved`.

**Example Request**:
```bash
POST /api/admin/orders/order-123/approve
```

**Response**:
```typescript
{
  success: true,
  data: Order,  // Updated order with status: 'approved'
  message: 'Order approved successfully'
}
```

#### Reject Order
**Endpoint**: `POST /api/admin/orders/{id}/reject`

**Description**: Rejects a pending or confirmed order, changing status to `rejected`.

**Request Body**:
```typescript
{
  reason?: string;  // Optional rejection reason
}
```

**Example Request**:
```bash
POST /api/admin/orders/order-123/reject
Content-Type: application/json

{
  "reason": "Out of stock"
}
```

#### Cancel Order
**Endpoint**: `POST /api/admin/orders/{id}/cancel`

**Description**: Cancels an order (cannot cancel delivered, cancelled, or refunded orders).

**Request Body**:
```typescript
{
  reason?: string;  // Optional cancellation reason
}
```

**Example Request**:
```bash
POST /api/admin/orders/order-123/cancel
Content-Type: application/json

{
  "reason": "Customer request"
}
```

---

## Client Site APIs

### 1. Products API

#### List Products
**Endpoint**: `GET /api/products`

**Query Parameters**:
- `page` (default: 1): Page number
- `limit` (default: 12): Items per page
- `category`: Filter by category name
- `categoryId`: Filter by category ID
- `color`: Filter by color ID or name
- `search`: Search in product name, description, or brand
- `minPrice`: Minimum price filter
- `maxPrice`: Maximum price filter
- `inStock`: Filter only in-stock products (`true`/`false`)
- `sortBy` (default: `createdAt`): Sort field (`name`, `price`, `createdAt`)
- `sortOrder` (default: `desc`): Sort direction (`asc`, `desc`)

**Response**: Products are automatically enriched with `colorOptions` array containing full color objects.

**Example Request**:
```bash
GET /api/products?category=Electronics&color=color-1&minPrice=50&maxPrice=500&inStock=true
```

#### Get Single Product
**Endpoint**: `GET /api/products/{id}`

**Description**: Returns detailed product information with enriched color options.

**Example Request**:
```bash
GET /api/products/product-123
```

#### Create Product
**Endpoint**: `POST /api/products`

**Request Body**:
```typescript
{
  name: string;                    // Required
  description: string;            // Required
  price: number;                  // Required, must be > 0
  originalPrice?: number;         // Optional, for discount calculation
  images: string[];               // Array of image URLs
  category: string;               // Required
  categoryId?: string;            // Optional category ID
  subcategory?: string;          // Optional
  brand: string;                 // Required
  sku: string;                   // Required, unique SKU
  stock: number;                 // Required, must be >= 0
  colors?: string[];             // Array of color IDs
  size?: string[];               // Array of size options
  tags?: string[];               // Array of tags
  specifications?: Record<string, any>;  // Additional specifications
}
```

**Example Request**:
```bash
POST /api/products
Content-Type: application/json

{
  "name": "Wireless Headphones",
  "description": "Premium wireless headphones",
  "price": 199.99,
  "originalPrice": 249.99,
  "images": ["https://example.com/image1.jpg"],
  "category": "Electronics",
  "categoryId": "cat-1",
  "brand": "TechSound",
  "sku": "TS-WH-001",
  "stock": 25,
  "colors": ["color-1", "color-2"],
  "size": ["One Size"],
  "tags": ["wireless", "premium"],
  "specifications": {
    "batteryLife": "30 hours",
    "connectivity": "Bluetooth 5.0"
  }
}
```

**Response**: Returns created product with auto-calculated discount percentage.

#### Update Product
**Endpoint**: `PUT /api/products/{id}`

**Request Body**: Same as create, but all fields are optional (only provided fields are updated).

**Example Request**:
```bash
PUT /api/products/product-123
Content-Type: application/json

{
  "stock": 30,
  "colors": ["color-1", "color-2", "color-3"]
}
```

#### Delete Product
**Endpoint**: `DELETE /api/products/{id}`

**Description**: Soft deletes product by setting `isActive` to `false`.

---

### 2. Categories API

#### List Categories
**Endpoint**: `GET /api/categories`

**Query Parameters**:
- `includeInactive` (default: `false`): Include inactive categories

**Example Request**:
```bash
GET /api/categories
```

#### Get Single Category
**Endpoint**: `GET /api/categories/{id}`

**Description**: Can use category ID or slug.

**Example Request**:
```bash
GET /api/categories/electronics
# or
GET /api/categories/cat-1
```

#### Create Category
**Endpoint**: `POST /api/categories`

**Request Body**:
```typescript
{
  name: string;           // Required
  slug: string;          // Required, must be unique
  description?: string; // Optional
  image?: string;        // Optional image URL
  parentId?: string;     // Optional parent category ID
}
```

**Example Request**:
```bash
POST /api/categories
Content-Type: application/json

{
  "name": "Electronics",
  "slug": "electronics",
  "description": "Electronic devices and accessories"
}
```

#### Update Category
**Endpoint**: `PUT /api/categories/{id}`

**Request Body**: All fields optional.

#### Delete Category
**Endpoint**: `DELETE /api/categories/{id}`

**Description**: Soft deletes category by setting `isActive` to `false`.

---

### 3. Colors API

#### List Colors
**Endpoint**: `GET /api/colors`

**Query Parameters**:
- `includeInactive` (default: `false`): Include inactive colors

**Example Request**:
```bash
GET /api/colors
```

#### Get Single Color
**Endpoint**: `GET /api/colors/{id}`

**Example Request**:
```bash
GET /api/colors/color-1
```

#### Create Color
**Endpoint**: `POST /api/colors`

**Request Body**:
```typescript
{
  name: string;      // Required, must be unique
  hexCode: string;   // Required, format: #RRGGBB or #RGB
}
```

**Example Request**:
```bash
POST /api/colors
Content-Type: application/json

{
  "name": "Red",
  "hexCode": "#FF0000"
}
```

#### Update Color
**Endpoint**: `PUT /api/colors/{id}`

**Request Body**:
```typescript
{
  name?: string;
  hexCode?: string;  // Format: #RRGGBB or #RGB
  isActive?: boolean;
}
```

#### Delete Color
**Endpoint**: `DELETE /api/colors/{id}`

**Description**: Soft deletes color by setting `isActive` to `false`.

---

## Data Models

### Product Model
```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;              // Auto-calculated
  images: string[];
  category: string;
  categoryId?: string;
  subcategory?: string;
  brand: string;
  sku: string;
  stock: number;
  colors?: string[];               // Array of color IDs
  colorOptions?: Color[];          // Enriched color objects
  size?: string[];
  isActive: boolean;
  tags: string[];
  specifications?: Record<string, any>;
  sellerId: string;
  createdAt: string;
  updatedAt: string;
}
```

### Order Model
```typescript
interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  status: OrderStatus;             // 'pending' | 'confirmed' | 'approved' | 'rejected' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  totalAmount: number;
  shippingAddress: Address;
  billingAddress?: Address;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  color?: string;                  // Selected color ID or name
  size?: string;                   // Selected size
}
```

### Category Model
```typescript
interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Color Model
```typescript
interface Color {
  id: string;
  name: string;
  hexCode: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

---

## Input Fields and Processing

### Product Creation/Update

**Required Fields**:
- `name`: Product name (string, required)
- `description`: Product description (string, required)
- `price`: Product price (number, must be > 0)
- `category`: Category name (string, required)
- `brand`: Brand name (string, required)
- `sku`: Stock Keeping Unit (string, required, should be unique)
- `stock`: Stock quantity (number, must be >= 0)

**Optional Fields**:
- `originalPrice`: Original price for discount calculation (number)
- `categoryId`: Category ID reference (string)
- `subcategory`: Subcategory name (string)
- `colors`: Array of color IDs (string[])
- `size`: Array of size options (string[])
- `images`: Array of image URLs (string[])
- `tags`: Array of tags (string[])
- `specifications`: Additional product specifications (object)

**Processing Logic**:
1. **Discount Calculation**: If `originalPrice` is provided and greater than `price`, discount percentage is auto-calculated:
   ```typescript
   discount = Math.round(((originalPrice - price) / originalPrice) * 100)
   ```

2. **Color Validation**: If `colors` array is provided, each color ID is validated against existing colors.

3. **Color Enrichment**: When fetching products, color IDs are automatically enriched with full color objects in the `colorOptions` field.

4. **Stock Validation**: Stock must be non-negative.

5. **Price Validation**: Price must be greater than 0.

### Order Management

**Order Status Flow**:
```
pending → confirmed → approved → shipped → delivered
         ↓
      rejected
         ↓
      cancelled
```

**Status Transitions**:
- **Approve**: `pending` or `confirmed` → `approved`
- **Reject**: `pending` or `confirmed` → `rejected`
- **Cancel**: Any status except `delivered`, `cancelled`, or `refunded` → `cancelled`

**Input Processing**:
- Order approval/rejection/cancellation accepts optional `reason` field
- Reason is stored in order `notes` field
- Status updates automatically update `updatedAt` timestamp

### Category Management

**Required Fields**:
- `name`: Category name (string, required)
- `slug`: URL-friendly slug (string, required, must be unique)

**Validation**:
- Slug uniqueness is checked before creation/update
- Slug format should be URL-friendly (lowercase, hyphens)

### Color Management

**Required Fields**:
- `name`: Color name (string, required, must be unique)
- `hexCode`: Hex color code (string, required, format: `#RRGGBB` or `#RGB`)

**Validation**:
- Hex code format validation using regex: `/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/`
- Color name uniqueness is checked
- Hex code is automatically converted to uppercase

---

## File Organization

### Backend Files Location

All backend API routes are organized in `src/app/api/`:

```
src/app/api/
├── admin/                    # Admin-only endpoints
│   ├── dashboard/
│   └── orders/
├── categories/               # Category management
├── colors/                   # Color management
└── products/                 # Product management
```

### Data Files

- **Types**: `src/types/index.ts` - All TypeScript interfaces
- **Dummy Data**: `src/lib/dummyData.ts` - Sample data for development

### Best Practices

1. **Single Responsibility**: Each route file handles one resource
2. **Consistent Naming**: Use RESTful conventions
3. **Error Handling**: All routes include try-catch blocks
4. **Validation**: Input validation before processing
5. **Type Safety**: Full TypeScript typing throughout
6. **Documentation**: JSDoc comments on all functions

---

## Usage Examples

### Admin Dashboard

```typescript
// Fetch dashboard stats for current month
const response = await fetch('/api/admin/dashboard?period=month');
const { data } = await response.json();
console.log(data.totalRevenue); // Total revenue for the month
console.log(data.recentOrders); // Recent orders array
```

### Product Listing with Filters

```typescript
// Fetch products with category and color filters
const response = await fetch(
  '/api/products?category=Electronics&color=color-1&minPrice=50&maxPrice=500&page=1&limit=12'
);
const { data, pagination } = await response.json();
console.log(data); // Array of products with enriched colorOptions
console.log(pagination); // Pagination info
```

### Create Product with Colors

```typescript
const productData = {
  name: 'Wireless Headphones',
  description: 'Premium wireless headphones',
  price: 199.99,
  originalPrice: 249.99,
  images: ['https://example.com/image.jpg'],
  category: 'Electronics',
  categoryId: 'cat-1',
  brand: 'TechSound',
  sku: 'TS-WH-001',
  stock: 25,
  colors: ['color-1', 'color-2'], // Color IDs
  size: ['One Size'],
  tags: ['wireless', 'premium']
};

const response = await fetch('/api/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(productData)
});
const { data } = await response.json();
```

### Order Management

```typescript
// Approve an order
const response = await fetch('/api/admin/orders/order-123/approve', {
  method: 'POST'
});
const { data } = await response.json();

// Reject an order with reason
const rejectResponse = await fetch('/api/admin/orders/order-123/reject', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ reason: 'Out of stock' })
});
```

### Category and Color Management

```typescript
// Create a new category
const category = await fetch('/api/categories', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Electronics',
    slug: 'electronics',
    description: 'Electronic devices'
  })
});

// Create a new color
const color = await fetch('/api/colors', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Red',
    hexCode: '#FF0000'
  })
});
```

---

## Future Enhancements

1. **Authentication**: Add JWT-based authentication middleware
2. **Database Integration**: Replace in-memory storage with database (PostgreSQL/MongoDB)
3. **File Upload**: Add image upload functionality for products/categories
4. **Caching**: Implement Redis caching for frequently accessed data
5. **Rate Limiting**: Add rate limiting to prevent abuse
6. **Webhooks**: Add webhook support for order status changes
7. **Analytics**: Enhanced analytics and reporting endpoints
8. **Search**: Full-text search implementation using Elasticsearch

---

## Notes

- All endpoints currently use in-memory storage for development
- Authentication checks are commented out (marked with `TODO`)
- In production, replace mock data with actual database operations
- All timestamps are in ISO 8601 format
- Color enrichment happens automatically on product fetch
- Discount calculation is automatic when `originalPrice` is provided

---

## Support

For questions or issues, please refer to the code comments in each route file or contact the development team.

