# Featured Products Manual Test Checklist

This checklist helps verify that the featured products feature works correctly in a development environment.

## Prerequisites

- [ ] Backend server is running (`pnpm backend:dev` or `pnpm dev:all`)
- [ ] Frontend is running (`pnpm dev`)
- [ ] Backend is accessible at `http://localhost:5000`
- [ ] Frontend is accessible at `http://localhost:3000`
- [ ] At least one product exists in the products database

## API Endpoint Tests

### 1. GET /api/featured

- [ ] **Test 1.1**: Request featured products when none exist
  - Open browser/Postman
  - GET `http://localhost:5000/api/featured`
  - Expected: `{ "success": true, "data": [] }`

- [ ] **Test 1.2**: Request featured products after adding some
  - Add a featured product first (see Test 2.1)
  - GET `http://localhost:5000/api/featured`
  - Expected: Array with at least one featured product

### 2. POST /api/admin/feature

- [ ] **Test 2.1**: Add a product to featured (valid data)
  - POST `http://localhost:5000/api/admin/feature`
  - Body:
    ```json
    {
      "productId": "prod-1",
      "name": "Test Product",
      "slug": "test-product",
      "price": 99.99,
      "thumbnail": "/test-image.jpg"
    }
    ```
  - Expected: `{ "success": true, "data": { ... } }`
  - Verify `featuredAt` timestamp is present

- [ ] **Test 2.2**: Add same product again (idempotency)
  - POST same product again with same `productId`
  - Expected: Success, but `featuredAt` timestamp should be updated
  - Verify no duplicate entries in GET response

- [ ] **Test 2.3**: Missing required field - productId
  - POST without `productId`
  - Expected: `400 Bad Request` with error message

- [ ] **Test 2.4**: Missing required field - name
  - POST without `name`
  - Expected: `400 Bad Request` with error message

- [ ] **Test 2.5**: Missing required field - slug
  - POST without `slug`
  - Expected: `400 Bad Request` with error message

- [ ] **Test 2.6**: Missing required field - price
  - POST without `price`
  - Expected: `400 Bad Request` with error message

- [ ] **Test 2.7**: Missing required field - thumbnail
  - POST without `thumbnail`
  - Expected: `400 Bad Request` with error message

- [ ] **Test 2.8**: Invalid price (negative)
  - POST with `price: -10`
  - Expected: `400 Bad Request` with error message

- [ ] **Test 2.9**: Invalid price (non-number)
  - POST with `price: "not-a-number"`
  - Expected: `400 Bad Request` with error message

- [ ] **Test 2.10**: Product does not exist
  - POST with `productId: "non-existent-product"`
  - Expected: `404 Not Found` with error message

### 3. DELETE /api/admin/feature/:productId

- [ ] **Test 3.1**: Remove featured product (exists)
  - First add a product (Test 2.1)
  - DELETE `http://localhost:5000/api/admin/feature/prod-1`
  - Expected: `{ "success": true }`
  - Verify product is removed from GET response

- [ ] **Test 3.2**: Remove non-featured product
  - DELETE `http://localhost:5000/api/admin/feature/non-existent`
  - Expected: `404 Not Found` with error message

- [ ] **Test 3.3**: Empty productId
  - DELETE `http://localhost:5000/api/admin/feature/   `
  - Expected: `400 Bad Request` with error message

## File System Tests

### 4. Atomic Write Safety

- [ ] **Test 4.1**: Verify temp files are cleaned up
  - Check `data/` directory
  - Should not contain `.tmp.*` files after operations
  - If temp files exist, they should be cleaned up on next write

- [ ] **Test 4.2**: Verify JSON file integrity
  - After multiple add/remove operations
  - Read `data/featured-products.json` directly
  - Should be valid JSON
  - Should contain correct data structure

## Admin UI Tests

### 5. Featured Toggle Component

- [ ] **Test 5.1**: Navigate to admin products page
  - Go to `http://localhost:3000/selleradmin/all-products`
  - Verify products are displayed

- [ ] **Test 5.2**: Toggle featured status (add)
  - Click star icon on a product
  - Verify star becomes filled/yellow
  - Verify API call is made (check Network tab)
  - Verify product appears in GET /api/featured response

- [ ] **Test 5.3**: Toggle featured status (remove)
  - Click star icon on a featured product
  - Verify star becomes unfilled
  - Verify API call is made (check Network tab)
  - Verify product is removed from GET /api/featured response

- [ ] **Test 5.4**: Loading state
  - Click star icon
  - Verify button shows loading state (disabled/opacity)
  - Verify loading state clears after API response

- [ ] **Test 5.5**: Error handling
  - Stop backend server
  - Click star icon
  - Verify error message is displayed
  - Verify error message clears after timeout

## Client Widget Tests

### 6. Featured Products Widget

- [ ] **Test 6.1**: Display featured products
  - Navigate to home page with FeaturedProducts component
  - Verify featured products are displayed (if any exist)
  - Verify correct product information (name, price, image)

- [ ] **Test 6.2**: Empty state
  - Remove all featured products
  - Refresh home page
  - Verify component doesn't render or shows appropriate message

- [ ] **Test 6.3**: Loading state
  - Check initial load
  - Verify loading indicator is shown

- [ ] **Test 6.4**: Polling (real-time updates)
  - Open browser DevTools Network tab
  - Wait 30 seconds
  - Verify new GET request to `/api/featured` is made
  - Add a featured product in admin panel
  - Wait up to 30 seconds
  - Verify new product appears without page refresh

- [ ] **Test 6.5**: Error handling
  - Stop backend server
  - Refresh home page
  - Verify error message is displayed
  - Restart backend
  - Verify products load correctly

- [ ] **Test 6.6**: Product links
  - Click on a featured product
  - Verify navigation to product details page
  - Verify correct product ID in URL

## Integration Tests

### 7. End-to-End Flow

- [ ] **Test 7.1**: Complete workflow
  1. Add product to featured via admin UI
  2. Verify product appears in admin UI (star filled)
  3. Navigate to home page
  4. Verify product appears in Featured Products section
  5. Remove product from featured via admin UI
  6. Wait up to 30 seconds
  7. Verify product disappears from home page

- [ ] **Test 7.2**: Multiple products
  1. Add 3-4 products to featured
  2. Verify all appear on home page
  3. Verify sorting (most recent first)
  4. Verify limit to 4 products displayed

- [ ] **Test 7.3**: Concurrent operations
  1. Open two browser tabs (admin panel)
  2. Add different products to featured in each tab
  3. Verify both operations succeed
  4. Verify both products appear in GET /api/featured
  5. Verify no data corruption in JSON file

## Performance Tests

### 8. Performance

- [ ] **Test 8.1**: Response time
  - GET /api/featured should respond in < 100ms
  - POST /api/admin/feature should respond in < 200ms
  - DELETE /api/admin/feature/:productId should respond in < 200ms

- [ ] **Test 8.2**: Large dataset
  - Add 50+ featured products
  - Verify GET /api/featured still responds quickly
  - Verify client widget handles large list (if applicable)

## Browser Compatibility

### 9. Cross-Browser

- [ ] **Test 9.1**: Chrome/Edge
- [ ] **Test 9.2**: Firefox
- [ ] **Test 9.3**: Safari (if available)
- [ ] **Test 9.4**: Mobile browser (if testing mobile)

## Notes

- All tests should be performed in development environment
- Use browser DevTools to monitor network requests
- Check browser console for any JavaScript errors
- Verify backend console logs for any errors
- Test both success and error scenarios

## Known Issues / Notes

Document any issues found during testing:

- Issue 1: [Description]
- Issue 2: [Description]





