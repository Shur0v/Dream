# Featured Products Feature Documentation

## Overview

The Featured Products feature allows administrators to mark products as "featured" and display them prominently on the client-facing website. The system uses a JSON file (`data/featured-products.json`) as the single source of truth for featured products.

## Architecture

### Data Storage

- **File**: `data/featured-products.json`
- **Format**: Array of `FeaturedProduct` objects
- **Structure**:
  ```typescript
  interface FeaturedProduct {
    productId: string;
    name: string;
    slug: string;
    price: number;
    thumbnail: string;
    featuredAt: string; // ISO timestamp
  }
  ```

### API Endpoints

#### GET /api/featured
Returns all featured products.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "productId": "prod-1",
      "name": "Product Name",
      "slug": "product-name",
      "price": 99.99,
      "thumbnail": "/image.jpg",
      "featuredAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "message": "Featured products retrieved successfully"
}
```

#### POST /api/admin/feature
Adds a product to featured products (idempotent operation).

**Request Body:**
```json
{
  "productId": "prod-1",
  "name": "Product Name",
  "slug": "product-name",
  "price": 99.99,
  "thumbnail": "/image.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "productId": "prod-1",
    "name": "Product Name",
    "slug": "product-name",
    "price": 99.99,
    "thumbnail": "/image.jpg",
    "featuredAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Product added to featured products successfully"
}
```

**Idempotency**: If the product is already featured, the `featuredAt` timestamp is updated but no duplicate is created.

#### DELETE /api/admin/feature/:productId
Removes a product from featured products.

**Response:**
```json
{
  "success": true,
  "message": "Product removed from featured products successfully"
}
```

## File Safety

### Atomic Writes

The system uses atomic file writes to prevent data corruption:

1. Write data to a temporary file: `featured-products.json.tmp.{timestamp}.{random}`
2. Rename temp file to target file (atomic operation on most filesystems)
3. Clean up any leftover temp files on error

This ensures that if the process crashes during a write, the original file remains intact.

## Real-Time Updates

### Polling (Current Implementation)

The client-side widget uses polling to fetch updates every 30 seconds:

```typescript
useEffect(() => {
  // Initial fetch
  fetchFeaturedProducts();

  // Poll every 30 seconds
  const interval = setInterval(fetchFeaturedProducts, 30000);

  return () => clearInterval(interval);
}, []);
```

### Server-Sent Events (SSE) - Alternative

For real-time updates without polling, you can implement Server-Sent Events:

**Backend (Express):**
```typescript
router.get('/featured/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sendUpdate = async () => {
    const featured = await getFeaturedProducts();
    res.write(`data: ${JSON.stringify(featured)}\n\n`);
  };

  // Send initial data
  sendUpdate();

  // Send updates when data changes
  const interval = setInterval(sendUpdate, 5000);

  req.on('close', () => {
    clearInterval(interval);
    res.end();
  });
});
```

**Frontend (React):**
```typescript
useEffect(() => {
  const eventSource = new EventSource(`${apiUrl}/featured/stream`);

  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    setProducts(data);
  };

  eventSource.onerror = (error) => {
    console.error('SSE error:', error);
    eventSource.close();
  };

  return () => {
    eventSource.close();
  };
}, []);
```

### WebSocket - Alternative

For bidirectional real-time updates:

**Backend (using `ws` library):**
```typescript
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
  // Send initial data
  sendFeaturedProducts(ws);

  // Send updates when data changes
  const interval = setInterval(() => {
    sendFeaturedProducts(ws);
  }, 5000);

  ws.on('close', () => {
    clearInterval(interval);
  });
});

async function sendFeaturedProducts(ws: WebSocket) {
  const featured = await getFeaturedProducts();
  ws.send(JSON.stringify(featured));
}
```

**Frontend (React):**
```typescript
useEffect(() => {
  const ws = new WebSocket('ws://localhost:8080');

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    setProducts(data);
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  return () => {
    ws.close();
  };
}, []);
```

## Usage Examples

### Admin UI - Toggle Featured Status

```tsx
import FeaturedToggle from '@/app/selleradmin/components/product/FeaturedToggle';

<FeaturedToggle
  productId={product.id}
  productName={product.name}
  productSlug={product.slug}
  productPrice={product.price}
  productThumbnail={product.images[0]}
/>
```

### Client Widget - Display Featured Products

```tsx
import FeaturedProducts from '@/app/client/home/components/FeaturedProducts';

// In your page component
<FeaturedProducts />
```

## Validation

### Required Fields

- `productId`: Non-empty string
- `name`: Non-empty string
- `slug`: Non-empty string
- `price`: Non-negative number
- `thumbnail`: Non-empty string

### Product Existence Check

Before adding a product to featured, the system verifies that the product exists in the products database.

## Error Handling

### API Errors

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message"
}
```

### Common Error Codes

- `400 Bad Request`: Invalid input data
- `404 Not Found`: Product not found or not featured
- `500 Internal Server Error`: Server/database error

## Testing

### Unit Tests

Run tests with:
```bash
pnpm test
```

Tests are located in `backend/__tests__/featured.test.ts`

### Manual Testing

See `FEATURED_PRODUCTS_TEST_CHECKLIST.md` for comprehensive manual testing checklist.

## Database Connection

The featured products system uses the same database pattern as other entities (products, categories, etc.):

- JSON file storage in `data/` directory
- In-memory caching with 5-minute TTL
- Atomic file writes for safety

## Best Practices

1. **Idempotency**: Always use POST to add featured products - it's safe to call multiple times
2. **Validation**: Always validate product data before adding to featured
3. **Error Handling**: Always handle API errors gracefully in UI
4. **Polling**: Adjust polling interval based on update frequency needs (default: 30s)
5. **Caching**: The backend caches featured products for 5 minutes to reduce file I/O

## Troubleshooting

### Featured products not appearing

1. Check if products are actually featured: `GET /api/featured`
2. Verify JSON file exists: `data/featured-products.json`
3. Check file permissions
4. Verify API endpoint is accessible
5. Check browser console for errors

### File corruption

1. Check for temp files in `data/` directory
2. Verify JSON file is valid JSON
3. Restore from backup if needed
4. The system should auto-cleanup temp files, but manual cleanup may be needed

### Performance issues

1. Reduce polling interval if too frequent
2. Consider implementing SSE or WebSocket for real-time updates
3. Check backend logs for slow operations
4. Verify caching is working (check cache TTL)

## Future Enhancements

- [ ] Add featured product ordering/priority
- [ ] Add featured product expiration dates
- [ ] Add featured product categories
- [ ] Add analytics for featured product views
- [ ] Implement SSE or WebSocket for real-time updates
- [ ] Add featured product scheduling





