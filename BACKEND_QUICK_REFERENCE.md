# Backend Quick Reference Guide

## API Endpoints Summary

### Admin Panel

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/dashboard` | GET | Dashboard statistics (revenue, products, orders) |
| `/api/admin/orders` | GET | List all orders with filters |
| `/api/admin/orders/recent` | GET | Get recent orders |
| `/api/admin/orders/{id}/approve` | POST | Approve an order |
| `/api/admin/orders/{id}/reject` | POST | Reject an order |
| `/api/admin/orders/{id}/cancel` | POST | Cancel an order |

### Products

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/products` | GET | List products (with filters: category, color, price, etc.) |
| `/api/products` | POST | Create new product |
| `/api/products/{id}` | GET | Get single product |
| `/api/products/{id}` | PUT | Update product |
| `/api/products/{id}` | DELETE | Delete product (soft delete) |

### Categories

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/categories` | GET | List all categories |
| `/api/categories` | POST | Create category |
| `/api/categories/{id}` | GET | Get single category |
| `/api/categories/{id}` | PUT | Update category |
| `/api/categories/{id}` | DELETE | Delete category (soft delete) |

### Colors

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/colors` | GET | List all colors |
| `/api/colors` | POST | Create color |
| `/api/colors/{id}` | GET | Get single color |
| `/api/colors/{id}` | PUT | Update color |
| `/api/colors/{id}` | DELETE | Delete color (soft delete) |

## Key Features

### Product Features
- ✅ Dynamic color options (enriched automatically)
- ✅ Category filtering (by name or ID)
- ✅ Color filtering
- ✅ Price range filtering
- ✅ Stock filtering
- ✅ Search functionality
- ✅ Pagination
- ✅ Sorting

### Order Management
- ✅ List orders with multiple filters
- ✅ Approve orders
- ✅ Reject orders (with reason)
- ✅ Cancel orders (with reason)
- ✅ Recent orders endpoint
- ✅ Status-based filtering

### Dashboard
- ✅ Total revenue calculation
- ✅ Product count
- ✅ Order statistics
- ✅ Period-based filtering (today, week, month, year)
- ✅ Revenue by period chart data

## Input Fields Quick Reference

### Create Product
**Required**: `name`, `description`, `price`, `category`, `brand`, `sku`, `stock`
**Optional**: `originalPrice`, `categoryId`, `colors[]`, `size[]`, `images[]`, `tags[]`, `specifications`

### Create Category
**Required**: `name`, `slug`
**Optional**: `description`, `image`, `parentId`

### Create Color
**Required**: `name`, `hexCode` (format: `#RRGGBB` or `#RGB`)
**Optional**: None

### Order Actions
**Approve/Reject/Cancel**: Optional `reason` field in request body

## Response Format

```typescript
{
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  }
}
```

## File Locations

- **API Routes**: `src/app/api/`
- **Types**: `src/types/index.ts`
- **Dummy Data**: `src/lib/dummyData.ts`
- **Full Documentation**: `BACKEND_DOCUMENTATION.md`

## Common Query Parameters

### Products
- `page`, `limit`, `category`, `categoryId`, `color`, `search`, `minPrice`, `maxPrice`, `inStock`, `sortBy`, `sortOrder`

### Orders
- `page`, `limit`, `status`, `search`, `startDate`, `endDate`, `sortBy`, `sortOrder`

### Dashboard
- `period` (all, today, week, month, year), `status`

## Notes

- All timestamps are in ISO 8601 format
- Color enrichment happens automatically on product fetch
- Discount is auto-calculated when `originalPrice` is provided
- All deletes are soft deletes (sets `isActive: false`)
- Authentication is currently commented out (TODO for production)

