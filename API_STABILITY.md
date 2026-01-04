# API Stability Guidelines

## GET API Routes - DO NOT CHANGE

এই document-এ সব GET API routes-এর list আছে। **পরবর্তীতে কোনো operation-এ এই routes change করা যাবে না** কারণ frontend এগুলো ব্যবহার করছে।

### Product Routes
- `GET /api/products` - List all products with filters
  - Query params: `page`, `limit`, `category`, `categoryId`, `color`, `search`, `minPrice`, `maxPrice`, `inStock`, `sortBy`, `sortOrder`
  
- `GET /api/products/:id` - Get single product by ID

### Category Routes
- `GET /api/categories` - List all categories
  - Query params: `limit`, `forceRefresh`
  
- `GET /api/categories/:id` - Get single category by ID

### Color Routes
- `GET /api/colors` - List all colors
  - Query params: `limit`
  
- `GET /api/colors/:id` - Get single color by ID

### Featured Products Routes
- `GET /api/featured-products` - List featured products
  - Query params: `limit`

### Best Selling Products Routes
- `GET /api/best-selling-products` - List best selling products
  - Query params: `limit`

### Hero Banner Routes
- `GET /api/hero-banners` - Get active hero banner

- `GET /api/hero-banners/:id` - Get hero banner by ID

### Promo Banner Routes
- `GET /api/promo-banners` - List promo banners
  - Query params: `variant`, `limit`

- `GET /api/promo-banners/:id` - Get promo banner by ID

### Festival Banner Routes
- `GET /api/festival-banners` - List festival banners
  - Query params: `limit`

- `GET /api/festival-banners/:id` - Get festival banner by ID

### Review Routes
- `GET /api/reviews` - List reviews
  - Query params: `productId`

- `GET /api/reviews/:id` - Get review by ID

## Important Notes

1. **DO NOT** change GET route paths/URLs
2. **DO NOT** remove query parameters that are currently used
3. **DO NOT** change response structure without updating frontend
4. **CAN** add new query parameters (optional)
5. **CAN** add new fields to response (as long as existing fields remain)

## Migration Status

✅ All GET routes are now using MongoDB
✅ All routes have performance logging
✅ All routes maintain backward compatibility

## Breaking Changes Policy

যদি কোনো breaking change প্রয়োজন হয়:
1. Create a new route version (e.g., `/api/v2/products`)
2. Keep old route working
3. Update frontend gradually
4. Deprecate old route after migration

