# Homepage Responsive Audit Report

**Date:** 2025-01-XX  
**Objective:** Make homepage fully responsive while preserving 1320px+ design unchanged  
**Status:** In Progress

## 1. Component Inventory

### 1.1 Layout Components
- **Header** (`src/components/layout/Header.tsx`)
  - TopBar (`src/components/layout/TopBar.tsx`)
  - MainHeader (`src/components/layout/MainHeader.tsx`)
  - BottomNav (`src/components/layout/BottomNav.tsx`)
- **Footer** (`src/components/layout/Footer.tsx`)
- **MainLayout** (`src/components/layout/MainLayout.tsx`)

### 1.2 Homepage Components
- **Hero** (`src/app/client/home/components/Hero/index.tsx`)
- **BrowseCategories** (`src/app/client/home/components/BrowseCategories.tsx`)
- **FeaturedProducts** (`src/app/client/home/components/FeaturedProducts.tsx`)
- **BestSelling** (`src/app/client/home/components/BestSelling.tsx`)
- **PromoBanners** (`src/app/client/home/components/PromoBanners.tsx`)
- **DiscountPromo** (`src/app/client/home/components/DiscountPromo.tsx`)
- **ForYou** (`src/app/client/home/components/ForYou.tsx`)
- **FeaturesSection** (`src/app/client/home/components/FeaturesSection.tsx`)

### 1.3 Shared Components
- **ProductCard** (`src/components/product/ProductCard.tsx`)
- **CartDropdown** (`src/components/cart/CartDropdown.tsx`)
- **WishlistDropdown** (`src/components/wishlist/WishlistDropdown.tsx`)

## 2. Current Styling Analysis

### 2.1 Container Strategy
- **Primary Wrapper:** All sections use `max-w-[1320px] mx-auto`
- **Location:** Consistent across all homepage components
- **Status:** ✅ Already implemented correctly

### 2.2 Hardcoded Dimensions

#### Header Components
- **TopBar:**
  - Max-width: `1320px` (container)
  - Font sizes: `text-sm` (14px)
  - Padding: `py-1`
  - **Needs:** Mobile contact simplification (already partially done)

- **MainHeader:**
  - Logo: `w-[190.5px] h-[69.3px]`
  - Search bar: `lg:w-[519px]`
  - Cart/Wishlist icons: `w-5 h-5`, `w-6 h-6`
  - **Needs:** Mobile hamburger menu, responsive search

- **BottomNav:**
  - Gap: `gap-4 sm:gap-8 lg:gap-12`
  - Font: `text-sm`
  - **Needs:** Mobile drawer/hamburger

#### Hero Section
- **Left Slider:**
  - Width: `lg:w-[804px]` (desktop)
  - Height: `h-[513px]`
  - **Status:** ✅ Already has responsive classes

- **Right Grid:**
  - Width: `lg:w-[492px]`
  - Top image: `h-[229px]`
  - Bottom images: `w-[234px] h-[260px]` each
  - **Needs:** Stack on mobile, maintain aspect ratios

#### BrowseCategories
- **Container:** `w-[1320px]` (hardcoded - needs fix)
- **Card:** `flex-1` (6 cards)
  - Image: `h-40`
  - Font: `text-3xl`
  - **Needs:** Responsive grid (3 cols tablet, 2 cols mobile)

#### FeaturedProducts
- **Container:** `h-[532px]` (hardcoded height)
- **Product Cards:** `w-[312px]` each
- **Layout:** Horizontal flex with `justify-between`
- **Products Shown:** All from `getFeaturedProducts()` (4 products)
- **Requirement:** Must show exactly 4 products (2 per row, 2 rows)
- **Needs:** 
  - Grid layout: 2 columns desktop, 1 column mobile
  - Limit to first 4 products for homepage
  - Remove hardcoded height

#### BestSelling
- **Container:** `h-[532px]` (hardcoded height)
- **Product Cards:** `w-[312px]` each
- **Layout:** Horizontal flex with `justify-between`
- **Products Shown:** All from `getBestSellingProducts()` (4 products)
- **Requirement:** Must show exactly 4 products (2 per row, 2 rows)
- **Needs:**
  - Grid layout: 2 columns desktop, 1 column mobile
  - Limit to first 4 products for homepage
  - Remove hardcoded height

#### PromoBanners
- **Container:** `w-[1320px]` (hardcoded - needs fix)
- **Card:** `h-[529px]`
  - Left text: `w-[550px]`
  - Right image: `w-[655px]`
- **Needs:** Stack on mobile, responsive text/image sizing

#### FeaturesSection
- **Cards:** `w-[312px]` each (4 cards)
- **Layout:** `justify-between` flex
- **Needs:** Responsive grid (2 cols tablet, 1 col mobile)

#### Footer
- **Container:** `max-w-[1320px]`
- **Sections:** Fixed widths (`w-96`, `w-36`, `w-32`)
- **Needs:** Stack columns on mobile

## 3. Desktop Freeze Profile (>=1320px)

### 3.1 Immutable Values (Must Not Change)
- Container max-width: `1320px`
- Product card width: `312px`
- Hero slider width: `804px`
- Hero right grid width: `492px`
- Font sizes: All current desktop sizes
- Spacing: All current gaps and paddings
- Hover states: All current hover effects
- Z-index: All current layering

### 3.2 Desktop Freeze Markers
Each component will have comments marking desktop freeze rules:
```tsx
{/* DESKTOP FREEZE: >=1320px - DO NOT MODIFY */}
{/* ... desktop styles ... */}
{/* END DESKTOP FREEZE */}
```

## 4. Breakpoint Plan

### 4.1 Breakpoints
- **>= 1320px:** Desktop (FROZEN - exact current design)
- **1024px - 1319px:** Laptop/Large Tablet (VISUALLY IDENTICAL to 1320+)
- **768px - 1023px:** Tablet Landscape (responsive algorithm starts)
- **480px - 767px:** Small Tablet/Large Phone (responsive layout active)
- **< 480px:** Mobile (full responsive stack)

### 4.2 Implementation Strategy
- Use Tailwind responsive prefixes: `lg:` (1024px+), `md:` (768px+), `sm:` (640px+)
- Custom breakpoints via `@media` queries where needed
- Mobile-first approach with desktop freeze overrides

## 5. Component-Specific Requirements

### 5.1 FeaturedProducts & BestSelling
**CRITICAL REQUIREMENT:**
- Show exactly 4 products (2 per row, 2 rows) on homepage
- Use CSS Grid: `grid-cols-2` for desktop, `grid-cols-1` for mobile
- Limit products: `.slice(0, 4)` in component
- Remove hardcoded height: `h-[532px]` → `min-h-[532px]` or auto

### 5.2 Hero Section
- Desktop: Keep current layout (804px + 492px)
- Tablet: Stack vertically, maintain aspect ratios
- Mobile: Full width slider, stack banners

### 5.3 Header
- Desktop: Keep current layout
- Mobile: Hamburger menu, drawer navigation
- Touch targets: Minimum 44px

## 6. Third-Party Dependencies
- **Next.js Image:** Already responsive
- **Lucide Icons:** Scalable SVG
- **Tailwind CSS:** Responsive utilities available

## 7. Global CSS Impact
- Check `src/app/globals.css` for any global rules affecting layout
- Ensure no conflicting responsive rules

## 8. Testing Checklist

### 8.1 Visual Regression Test Widths
- 1366px (Desktop)
- 1320px (Desktop - freeze point)
- 1280px (Laptop)
- 1024px (Laptop/Large Tablet)
- 912px (Tablet)
- 768px (Tablet Landscape)
- 480px (Mobile)
- 375px (Mobile)
- 320px (Small Mobile)

### 8.2 Component-Specific Tests
- [ ] Header unchanged at 1320px
- [ ] Hero overlay identical at 1320px
- [ ] FeaturedProducts: 2 per row, 4 total on homepage
- [ ] BestSelling: 2 per row, 4 total on homepage
- [ ] Footer unchanged at 1320px
- [ ] All hover states preserved at 1320px
- [ ] Mobile navigation functional
- [ ] Touch targets >= 44px on mobile

## 9. Performance Considerations
- No additional bundle size for desktop users
- Lazy load mobile-only assets if added
- Keep critical CSS unchanged for desktop

## 10. Accessibility Requirements
- All interactive elements have accessible labels
- Focus states preserved
- Touch targets >= 44px on mobile
- Keyboard navigation maintained

## 11. Commit Strategy
- One commit per component modification
- Format: `responsive: <component-name> — preserve 1320px design, add mobile variants`
- Final PR: `responsive/homepage-preserve-1320`

## 12. Edge Cases
- Very wide screens (>1920px): Center content, maintain 1320px max-width
- Very narrow screens (<320px): Ensure no horizontal scroll
- Landscape mobile: Test at 667px width
- Tablet portrait: Test at 768px width

## 13. Notes
- Product data source unchanged (only limit display)
- All JS behavior preserved
- Component APIs unchanged
- Redux/Context logic unchanged



