# MongoDB Migration Guide - Complete Step-by-Step

## 🎯 Main Objective
Transfer all data from JSON files to MongoDB, delete JSON files, and ensure all features (products, featured products, best selling, orders, etc.) work with MongoDB database.

---

## ⚠️ IMPORTANT: Environment & Connection Setup

### 📁 `.env` File Configuration (Backend)
```env
# MongoDB Connection - MUST BE SET FIRST
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dream?retryWrites=true&w=majority

# Server Configuration
PORT=5000
NODE_ENV=development

# Other Environment Variables (if any)

===============  Here all original to use  ===================

BACKEND_PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

MONGODB_URI=mongodb+srv://shurovbbs_db_user:xYT6Pbbwv8IvFexf@dreamshopdb.n3vg4we.mongodb.net/dream?retryWrites=true&w=majority
MONGODB_DB_NAME=dream


```

### 📍 Connection Files Location
- **Database Connection**: `backend/config/database.ts`
- **MongoDB Models**: `backend/models/`
- **Database Functions**: `backend/lib/db.ts`
- **Express Routes**: `backend/routes/`

### ✅ Pre-Migration Checklist
- [ ] MongoDB connection string is correct in `.env`
- [ ] MongoDB cluster is accessible
- [ ] All required npm packages are installed
- [ ] Backend server can start without errors

---

## 📋 Step-by-Step Migration Process

### **STEP 1: Backup Current Data** ✅
**Status:** ⬜ Not Started

**Actions:**
1. Create backup folder: `backend/database/backup/`
2. Copy all JSON files to backup:
   ```bash
   cp backend/database/*.json backend/database/backup/
   ```
3. Verify backup files exist

**Files to Backup:**
- `backend/database/products.json`
- `backend/database/categories.json`
- `backend/database/colors.json`
- `backend/database/users.json`
- `backend/database/orders.json`
- `backend/database/database.json`

**Verification:**
- [ ] All JSON files copied to backup folder
- [ ] Backup folder contains all 6 files

---

### **STEP 2: Clear MongoDB Database** ✅
**Status:** ⬜ Not Started

**Actions:**
1. Connect to MongoDB (via MongoDB Compass or CLI)
2. Select database: `dream`
3. Delete all collections:
   - `products`
   - `categories`
   - `colors`
   - `users`
   - `orders`
   - `featuredproducts`
   - `bestsellingproducts`
   - `herobanners`
   - `promobanners`
   - `festivalbanners`

**Alternative: Drop entire database and recreate:**
```javascript
// In MongoDB shell or Compass
use dream
db.dropDatabase()
```

**Verification:**
- [ ] All collections deleted or database dropped
- [ ] Database is empty and ready for migration

---

### **STEP 3: Verify Migration Script** ✅
**Status:** ⬜ Not Started

**File:** `backend/scripts/migrate-to-mongodb.ts`

**Check:**
1. Script exists and is readable
2. Script imports all required models
3. Script reads from JSON files correctly
4. Script writes to MongoDB correctly

**Run Migration:**
```bash
npm run migrate:mongodb
```

**Verification:**
- [ ] Migration script runs without errors
- [ ] All data transferred to MongoDB
- [ ] Check MongoDB - all collections have data

---

### **STEP 4: Update Backend Limits to 10** ✅
**Status:** ⬜ Not Started

**Files to Update:**

#### 4.1 Update Products Route
**File:** `backend/routes/products/index.ts`
- Line 27: Change default limit from `12` to `10`
- Line 161: Ensure pagination uses limit of 10

**Changes:**
```typescript
const limit = parseInt(searchParams.get('limit') || '10'); // Changed from '12'
```

#### 4.2 Update Other Routes
Check and update limits in:
- `backend/routes/categories/index.ts` - Set limit to 10
- `backend/routes/colors/index.ts` - Set limit to 10
- `backend/routes/featured-products/index.ts` - Set limit to 10
- `backend/routes/best-selling-products/index.ts` - Set limit to 10

**Verification:**
- [ ] All routes default to limit 10
- [ ] Pagination works correctly with limit 10
- [ ] API responses are faster

---

### **STEP 5: Remove JSON File Dependencies** ✅
**Status:** ⬜ Not Started

**Files to Update:**

#### 5.1 Update `backend/lib/db.ts`
**Remove:**
- All `readDatabase()` function calls
- All `writeDatabase()` function calls
- JSON file reading logic

**Replace with:**
- MongoDB queries using models
- Direct database operations

**Functions to Update (Specific List):**

**Featured Products Functions (Lines 547-675):**
- `getFeaturedProducts()` - Line 548: Replace `readDatabase()` with `FeaturedProductModel.find({ isActive: true }).lean()`
- `getFeaturedProductById()` - Line 558: Replace with `FeaturedProductModel.findById(id).lean()`
- `getFeaturedProductByProductId()` - Line 568: Replace with `FeaturedProductModel.findOne({ productId, isActive: true }).lean()`
- `addFeaturedProduct()` - Lines 578-604: Replace JSON logic with MongoDB operations
- `removeFeaturedProduct()` - Lines 613-623: Replace with `FeaturedProductModel.updateOne()`
- `removeFeaturedProductById()` - Lines 632-642: Replace with `FeaturedProductModel.findByIdAndUpdate()`
- `updateFeaturedProduct()` - Lines 651-674: Replace with MongoDB find and update operations

**Best Selling Products Functions (Lines 681-809):**
- `getBestSellingProducts()` - Line 682: Replace `readDatabase()` with `BestSellingProductModel.find({ isActive: true }).lean()`
- `getBestSellingProductById()` - Line 692: Replace with `BestSellingProductModel.findById(id).lean()`
- `getBestSellingProductByProductId()` - Line 702: Replace with `BestSellingProductModel.findOne({ productId, isActive: true }).lean()`
- `addBestSellingProduct()` - Lines 712-738: Replace JSON logic with MongoDB operations
- `removeBestSellingProduct()` - Lines 747-757: Replace with `BestSellingProductModel.updateOne()`
- `removeBestSellingProductById()` - Lines 766-776: Replace with `BestSellingProductModel.findByIdAndUpdate()`
- `updateBestSellingProduct()` - Lines 785-808: Replace with MongoDB find and update operations

**Note:** Products, Categories, Colors, Orders, Hero Banners, Promo Banners, and Festival Banners are already using MongoDB ✅

#### 5.2 Check `backend/express-lib/db.ts`
- Ensure all functions use MongoDB models
- Remove any JSON file references

**Verification:**
- [ ] No `readDatabase()` calls remain
- [ ] No `writeDatabase()` calls remain
- [ ] All functions use MongoDB models

---

### **STEP 6: Delete JSON Files** ✅
**Status:** ⬜ Not Started

**⚠️ IMPORTANT: Only delete after verifying MongoDB has all data!**

**Files to Delete:**
```bash
rm backend/database/products.json
rm backend/database/categories.json
rm backend/database/colors.json
rm backend/database/users.json
rm backend/database/orders.json
rm backend/database/database.json
```

**Or delete entire database folder (after backup):**
```bash
rm -rf backend/database/
```

**Verification:**
- [ ] All JSON files deleted
- [ ] Application still works (uses MongoDB only)
- [ ] No errors in console about missing JSON files

---

### **STEP 7: Verify All CRUD Operations** ✅
**Status:** ⬜ Not Started

#### 7.1 Products CRUD
- [ ] **Create:** POST `/api/products` - Creates product in MongoDB
- [ ] **Read:** GET `/api/products` - Fetches from MongoDB
- [ ] **Read Single:** GET `/api/products/:id` - Fetches single product
- [ ] **Update:** PUT/PATCH `/api/products/:id` - Updates in MongoDB
- [ ] **Delete:** DELETE `/api/products/:id` - Soft deletes in MongoDB

#### 7.2 Categories CRUD
- [ ] **Create:** POST `/api/categories` - Creates category
- [ ] **Read:** GET `/api/categories` - Fetches categories
- [ ] **Update:** PUT `/api/categories/:id` - Updates category
- [ ] **Delete:** DELETE `/api/categories/:id` - Soft deletes category

#### 7.3 Colors CRUD
- [ ] **Create:** POST `/api/colors` - Creates color
- [ ] **Read:** GET `/api/colors` - Fetches colors
- [ ] **Update:** PUT `/api/colors/:id` - Updates color
- [ ] **Delete:** DELETE `/api/colors/:id` - Soft deletes color

#### 7.4 Orders CRUD
- [ ] **Create:** POST `/api/orders` - Creates order
- [ ] **Read:** GET `/api/orders` - Fetches orders (limit 10)
- [ ] **Read Single:** GET `/api/orders/:id` - Fetches single order
- [ ] **Update:** PUT `/api/orders/:id` - Updates order status
- [ ] **Dashboard:** GET `/api/admin/orders` - Shows orders in dashboard

#### 7.5 Featured Products
- [ ] **Read:** GET `/api/featured-products` - Fetches from MongoDB
- [ ] **Create:** POST `/api/featured-products` - Adds featured product
- [ ] **Delete:** DELETE `/api/featured-products/:id` - Removes featured

#### 7.6 Best Selling Products
- [ ] **Read:** GET `/api/best-selling-products` - Fetches from MongoDB
- [ ] **Create:** POST `/api/best-selling-products` - Adds best selling
- [ ] **Delete:** DELETE `/api/best-selling-products/:id` - Removes best selling

**Verification:**
- [ ] All CRUD operations work correctly
- [ ] Data persists in MongoDB
- [ ] No errors in API calls

---

### **STEP 8: Verify Order Creation & Dashboard** ✅
**Status:** ⬜ Not Started

#### 8.1 Order Creation Flow
1. User adds products to cart
2. User creates order via POST `/api/orders`
3. Order saved to MongoDB
4. Order appears in dashboard

**Test Steps:**
1. Create a test order:
   ```json
   POST /api/orders
   {
     "userId": "user-1",
     "items": [...],
     "total": 1000,
     "status": "pending"
   }
   ```
2. Verify order in MongoDB
3. Check dashboard endpoint: GET `/api/admin/orders`
4. Verify order appears in dashboard

**Verification:**
- [ ] Orders can be created
- [ ] Orders saved to MongoDB
- [ ] Dashboard shows orders
- [ ] Order status can be updated
- [ ] Order pagination works (limit 10)

---

### **STEP 9: Update Featured & Best Selling to Use MongoDB** ✅
**Status:** ⬜ Not Started

#### 9.1 Verify MongoDB Models Exist
**Check Models:**
- `backend/models/FeaturedProduct.ts` - ✅ Exists
- `backend/models/BestSellingProduct.ts` - ✅ Exists

**Update Model Exports:**
**File:** `backend/models/index.ts`

**Add these exports:**
```typescript
export { default as FeaturedProductModel } from './FeaturedProduct';
export { default as BestSellingProductModel } from './BestSellingProduct';
```

**Current exports (add the two above):**
- ProductModel ✅
- CategoryModel ✅
- ColorModel ✅
- UserModel ✅
- OrderModel ✅
- HeroBannerModel ✅
- PromoBannerModel ✅
- FestivalBannerModel ✅
- FeaturedProductModel - **ADD THIS**
- BestSellingProductModel - **ADD THIS**

#### 9.2 Import Models in db.ts
**File:** `backend/lib/db.ts`

**Add imports at the top of the file:**
```typescript
import { FeaturedProductModel, BestSellingProductModel } from '../models';
```

**Verify these imports exist:**
- ProductModel ✅
- CategoryModel ✅
- ColorModel ✅
- UserModel ✅
- OrderModel ✅
- HeroBannerModel ✅
- PromoBannerModel ✅
- FestivalBannerModel ✅
- FeaturedProductModel - **ADD THIS**
- BestSellingProductModel - **ADD THIS**

#### 9.3 Update Database Functions
**File:** `backend/lib/db.ts`

**Functions to Update (Replace readDatabase/writeDatabase with MongoDB):**

**Featured Products:**
1. `getFeaturedProducts()` (Line 547):
   ```typescript
   // OLD:
   const db = await readDatabase();
   return db.featuredProducts.filter(fp => fp.isActive);
   
   // NEW:
   await ensureConnection();
   const featured = await FeaturedProductModel.find({ isActive: true }).lean();
   return featured.map(fp => ({ ...fp, id: fp._id })) as FeaturedProduct[];
   ```

2. `getFeaturedProductById()` (Line 557):
   ```typescript
   // OLD:
   const db = await readDatabase();
   return db.featuredProducts.find(fp => fp.id === id);
   
   // NEW:
   await ensureConnection();
   const fp = await FeaturedProductModel.findById(id).lean();
   return fp ? { ...fp, id: fp._id } as FeaturedProduct : undefined;
   ```

3. `getFeaturedProductByProductId()` (Line 567):
   ```typescript
   // OLD:
   const db = await readDatabase();
   return db.featuredProducts.find(fp => fp.productId === productId && fp.isActive);
   
   // NEW:
   await ensureConnection();
   const fp = await FeaturedProductModel.findOne({ productId, isActive: true }).lean();
   return fp ? { ...fp, id: fp._id } as FeaturedProduct : undefined;
   ```

4. `addFeaturedProduct()` (Line 577):
   ```typescript
   // OLD: JSON file operations
   // NEW:
   await ensureConnection();
   const existing = await FeaturedProductModel.findOne({ productId, isActive: true }).lean();
   if (existing) return { ...existing, id: existing._id } as FeaturedProduct;
   
   const product = await ProductModel.findById(productId).lean();
   if (!product) throw new Error(`Product with ID ${productId} not found`);
   
   const featuredData: any = {
     ...product,
     _id: `featured-${productId}-${Date.now()}`,
     productId: product._id,
     featuredAt: new Date(),
     isActive: true,
   };
   delete featuredData.id;
   
   const saved = await FeaturedProductModel.create(featuredData);
   return { ...saved.toObject(), id: saved._id } as FeaturedProduct;
   ```

5. `removeFeaturedProduct()` (Line 612):
   ```typescript
   // OLD: JSON file operations
   // NEW:
   await ensureConnection();
   const updated = await FeaturedProductModel.findOneAndUpdate(
     { productId, isActive: true },
     { isActive: false, updatedAt: new Date() },
     { new: true }
   ).lean();
   return updated ? { ...updated, id: updated._id } as FeaturedProduct : null;
   ```

6. `removeFeaturedProductById()` (Line 631):
   ```typescript
   // OLD: JSON file operations
   // NEW:
   await ensureConnection();
   const updated = await FeaturedProductModel.findByIdAndUpdate(
     id,
     { isActive: false, updatedAt: new Date() },
     { new: true }
   ).lean();
   return updated ? { ...updated, id: updated._id } as FeaturedProduct : null;
   ```

7. `updateFeaturedProduct()` (Line 650):
   ```typescript
   // OLD: JSON file operations
   // NEW:
   await ensureConnection();
   const product = await ProductModel.findById(productId).lean();
   if (!product) return null;
   
   const featured = await FeaturedProductModel.findOne({ productId, isActive: true }).lean();
   if (!featured) return null;
   
   const updateData: any = {
     ...product,
     _id: featured._id,
     productId: product._id,
     featuredAt: featured.featuredAt,
     updatedAt: new Date(),
   };
   delete updateData.id;
   
   const updated = await FeaturedProductModel.findByIdAndUpdate(
     featured._id,
     updateData,
     { new: true }
   ).lean();
   return updated ? { ...updated, id: updated._id } as FeaturedProduct : null;
   ```

**Best Selling Products (Same pattern as Featured Products):**
- Apply same MongoDB conversion pattern to all Best Selling Product functions (Lines 681-809)

**Verification:**
- [ ] Featured products fetched from MongoDB
- [ ] Best selling products fetched from MongoDB
- [ ] Can add/remove featured products
- [ ] Can add/remove best selling products

---

### **STEP 10: Performance Optimization** ✅
**Status:** ⬜ Not Started

#### 10.1 Set All Query Limits to 10
- Products: Limit 10
- Categories: Limit 10
- Colors: Limit 10
- Orders: Limit 10
- Featured Products: Limit 10
- Best Selling: Limit 10

#### 10.2 Add Indexes (if not exists)
Verify indexes in models:
- Products: `categoryId`, `isActive`, `slug`
- Categories: `slug`, `isActive`
- Colors: `isActive`
- Orders: `userId`, `status`, `createdAt`

#### 10.3 Enable Lean Queries
Ensure all queries use `.lean()` for faster performance:
```typescript
await Model.find().lean()
```

**Verification:**
- [ ] All queries use limit 10
- [ ] All queries use `.lean()`
- [ ] Indexes are created
- [ ] API response times are fast (< 200ms)

---

### **STEP 11: Final Testing** ✅
**Status:** ⬜ Not Started

#### 11.1 API Endpoint Testing
Test all endpoints:
- [ ] GET `/api/products` - Returns 10 products
- [ ] GET `/api/categories` - Returns 10 categories
- [ ] GET `/api/colors` - Returns 10 colors
- [ ] GET `/api/orders` - Returns 10 orders
- [ ] GET `/api/featured-products` - Returns from MongoDB
- [ ] GET `/api/best-selling-products` - Returns from MongoDB
- [ ] GET `/api/admin/orders` - Dashboard orders

#### 11.2 Frontend Testing
- [ ] Products page loads correctly
- [ ] Categories display correctly
- [ ] Orders can be created
- [ ] Dashboard shows orders
- [ ] Featured products display
- [ ] Best selling products display

#### 11.3 Database Verification
- [ ] All data in MongoDB
- [ ] No JSON file dependencies
- [ ] All CRUD operations work
- [ ] Performance is optimal

---

### **STEP 12: Cleanup & Documentation** ✅
**Status:** ⬜ Not Started

#### 12.1 Remove Unused Code
- Remove `jsonStore.ts` if exists
- Remove unused JSON reading functions
- Clean up imports

#### 12.2 Update Documentation
- Update README.md with MongoDB setup
- Document environment variables
- Document API endpoints

#### 12.3 Final Verification
- [ ] No console errors
- [ ] All features work
- [ ] Performance is good
- [ ] Code is clean

---

## 🚀 Quick Start Commands

### Start Backend Server
```bash
npm run backend:start
```

### Run Migration
```bash
npm run migrate:mongodb
```

### Check MongoDB Connection
```bash
# In MongoDB Compass or CLI
use dream
show collections
db.products.countDocuments()
```

### Test API Endpoints
```bash
# Test products
curl http://localhost:5000/api/products

# Test categories
curl http://localhost:5000/api/categories

# Test orders
curl http://localhost:5000/api/orders
```

---

## 📝 Progress Tracker

- [x] **STEP 1:** Backup Current Data ✅
- [ ] **STEP 2:** Clear MongoDB Database (Will be done by migration script)
- [x] **STEP 3:** Verify Migration Script ✅
- [x] **STEP 4:** Update Backend Limits to 10 ✅
- [x] **STEP 5:** Remove JSON File Dependencies ✅
- [ ] **STEP 6:** Delete JSON Files (After verification)
- [ ] **STEP 7:** Verify All CRUD Operations (After migration)
- [ ] **STEP 8:** Verify Order Creation & Dashboard (After migration)
- [x] **STEP 9:** Update Featured & Best Selling to Use MongoDB ✅
- [x] **STEP 10:** Performance Optimization ✅
- [ ] **STEP 11:** Final Testing (After migration)
- [x] **STEP 12:** Cleanup & Documentation ✅

---

## ⚠️ Important Notes

1. **Always backup before deleting JSON files**
2. **Test each step before moving to next**
3. **Verify MongoDB connection before migration**
4. **Keep limit at 10 for optimal performance**
5. **Use `.lean()` in all MongoDB queries**
6. **Mark each step as complete when done**

---

## 🆘 Troubleshooting

### MongoDB Connection Issues
- Check `.env` file has correct `MONGODB_URI`
- Verify MongoDB cluster is accessible
- Check network connectivity

### Migration Errors
- Verify JSON files exist in backup
- Check MongoDB connection
- Review migration script logs

### Performance Issues
- Ensure all queries use `.lean()`
- Verify indexes are created
- Check query limits are set to 10

---

**Last Updated:** [Current Date]
**Status:** Ready to Start Migration

