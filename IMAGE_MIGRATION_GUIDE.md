# Base64 to Cloudinary Image Migration Guide

## Overview
This guide explains how to migrate all Base64 images in MongoDB to optimized Cloudinary CDN URLs.

## Prerequisites

1. **Cloudinary Account Setup**
   - Create a Cloudinary account at https://cloudinary.com
   - Get your credentials:
     - `CLOUDINARY_CLOUD_NAME`
     - `CLOUDINARY_API_KEY`
     - `CLOUDINARY_API_SECRET`

2. **Environment Variables**
   Add to `backend/.env`:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

3. **Dependencies**
   - ✅ `cloudinary` (already installed)
   - ✅ `sharp` (already installed)
   - ✅ `mongoose` (already installed)

## Step-by-Step Migration

### Step 1: Scan for Base64 Images

First, scan your MongoDB database to identify all Base64 images:

```bash
npm run scan:base64
```

This will:
- Scan all collections (products, categories, featured-products, best-selling-products, promo-banners, hero-banners, festival-banners)
- Report Base64 image locations
- Estimate total size
- **Does NOT modify any data**

**Expected Output:**
```
🔍 Scanning MongoDB for Base64 images...
✅ Connected to MongoDB

📁 products: 15 documents
   ⚠️  Found 3 Base64 images:
      - images[0] (Product Name): ~250 KB
      - images[1] (Product Name): ~180 KB
...

📊 Summary:
   Total documents scanned: 50
   Total Base64 images found: 12
   Total estimated size: 2.5 MB
```

### Step 2: Review Scan Results

Review the scan output to:
- Verify which collections have Base64 images
- Check estimated sizes
- Ensure you have Cloudinary credentials configured

### Step 3: Run Migration

Once you've reviewed the scan results, run the migration:

```bash
npm run migrate:images
```

This will:
1. ✅ Scan all collections for Base64 images
2. ✅ Convert Base64 to optimized WebP images (max 700KB, quality 85%)
3. ✅ Upload optimized images to Cloudinary
4. ✅ Update MongoDB documents with CDN URLs
5. ✅ Report migration results

**Migration Process:**
- Each Base64 image is:
  - Converted to Buffer
  - Optimized using Sharp (WebP format, max 1920px, quality 85%)
  - Compressed to ≤700KB
  - Uploaded to Cloudinary CDN
  - MongoDB document updated with CDN URL

**Expected Output:**
```
🚀 Starting Base64 to Cloudinary Migration...
✅ Connected to MongoDB

📖 Step 1: Scanning collections for Base64 images...
  Scanning products...
    Found 3 Base64 images
...

🔄 Step 2: Migrating images to Cloudinary...
[1/12] Migrating products.images[0]...
  [products] images[0]: 250.45KB → 180.23KB
  ✅ Migrated to: https://res.cloudinary.com/your-cloud/image/upload/v1234567890/dream/products/product-id-123.webp

...

📊 Migration Summary:
   Documents scanned: 50
   Base64 images found: 12
   Successfully migrated: 12
   Failed: 0
   Skipped (already URLs): 0
   Total size before: 2.5 MB
   Total size after: ~0.6 MB (estimated)

✅ Migration completed!
```

### Step 4: Verify Migration

After migration, verify:
1. **API Responses**: Check that API responses now contain Cloudinary URLs instead of Base64
2. **Frontend Display**: Verify images display correctly on all pages
3. **Response Sizes**: Compare API response sizes (should be significantly smaller)

**Verification Commands:**
```bash
# Check API response
curl http://localhost:3000/api/products | jq '.data[0].images'

# Should show Cloudinary URLs like:
# "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/dream/products/..."
```

## Collections Scanned

The migration script scans these collections:

1. **products** - `images[]` field
2. **categories** - `image` field
3. **featuredProducts** - `images[]` field
4. **bestSellingProducts** - `images[]` field
5. **promoBanners** - `image`, `images[]` fields
6. **heroBanners** - `sliderImages[]`, `rightBanners[]` fields
7. **festivalBanners** - `image`, `images[]` fields

## Image Optimization Details

### Optimization Settings
- **Format**: WebP (best compression)
- **Max Size**: 700KB per image
- **Quality**: 85% (adjusts down if needed)
- **Max Dimensions**: 1920x1920px (maintains aspect ratio)
- **Resize Strategy**: `fit: inside` (no cropping)

### Cloudinary Upload Settings
- **Folder Structure**: `dream/{collection-name}/`
- **Public ID Format**: `{collection}-{documentId}-{timestamp}`
- **Transformations**: Auto quality, auto format
- **CDN URL**: Secure HTTPS URLs

## Error Handling

If migration fails:
1. Check Cloudinary credentials in `backend/.env`
2. Verify MongoDB connection
3. Check network connectivity
4. Review error messages in console

**Common Errors:**
- `Cloudinary credentials not found` → Add credentials to `backend/.env`
- `Upload failed` → Check Cloudinary API limits/quotas
- `Document not found` → Document may have been deleted during migration

## Rollback

If you need to rollback:
1. Restore from MongoDB backup (if available)
2. Or restore from JSON backup files in `backend/database/backup/`

## Performance Impact

### Before Migration
- API responses: 20-22 MB (with Base64)
- Load time: 3-9 minutes
- Network transfer: Very slow

### After Migration
- API responses: ~500 KB (with CDN URLs)
- Load time: <5 seconds
- Network transfer: Fast (CDN delivery)

## Frontend Changes

No frontend code changes required! The migration:
- ✅ Keeps all field names the same
- ✅ Maintains API response structure
- ✅ Preserves frontend data mapping
- ✅ Works with existing Next/Image components

## Next.js Image Configuration

Cloudinary is already configured in `next.config.ts`:
```typescript
remotePatterns: [
  {
    protocol: 'https',
    hostname: 'res.cloudinary.com',
    pathname: '/**',
  },
]
```

## Maintenance

After migration:
- New images uploaded via `/api/upload-image` will use Cloudinary
- Existing CDN URLs will continue to work
- No Base64 images should remain in database

## Support

If you encounter issues:
1. Run `npm run scan:base64` to verify Base64 detection
2. Check Cloudinary dashboard for upload status
3. Verify MongoDB documents were updated
4. Check API responses for CDN URLs

