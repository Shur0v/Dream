# Responsive Homepage QA Checklist

## Pre-Testing Setup
1. Clear browser cache
2. Test in incognito/private mode
3. Use browser DevTools responsive mode
4. Test on actual devices when possible

## Visual Regression Testing

### Test Widths (Screenshot Required)
Take screenshots at each width showing:
- Full homepage view
- Header section
- Hero section
- Featured Products section
- Best Selling section
- Footer section

#### Desktop (>=1320px) - FROZEN DESIGN
- [ ] **1366px** - Verify exact match to current design
- [ ] **1320px** - Verify exact match to current design (freeze point)

#### Laptop/Large Tablet (1024px - 1319px)
- [ ] **1280px** - Verify visually identical to 1320px
- [ ] **1024px** - Verify visually identical to 1320px

#### Tablet Landscape (768px - 1023px)
- [ ] **912px** - Verify responsive layout starts
- [ ] **768px** - Verify tablet layout

#### Small Tablet/Large Phone (480px - 767px)
- [ ] **480px** - Verify mobile layout active

#### Mobile (< 480px)
- [ ] **375px** - Verify mobile layout
- [ ] **320px** - Verify no horizontal scroll

## Component-Specific Testing

### Header
- [ ] **Desktop (>=1320px):** Header unchanged - exact match
- [ ] **Desktop (>=1320px):** Logo size: `190.5px × 69.3px`
- [ ] **Desktop (>=1320px):** Search bar width: `519px`
- [ ] **Desktop (>=1320px):** All icons visible and properly sized
- [ ] **Mobile (<1024px):** Hamburger menu appears
- [ ] **Mobile (<1024px):** Navigation drawer opens/closes
- [ ] **Mobile (<1024px):** Touch targets >= 44px
- [ ] **Mobile (<1024px):** Language selector works
- [ ] **Mobile (<1024px):** Cart/Wishlist modals work

### Hero Section
- [ ] **Desktop (>=1320px):** Slider width: `804px` (exact)
- [ ] **Desktop (>=1320px):** Right grid width: `492px` (exact)
- [ ] **Desktop (>=1320px):** Heights: `513px`, `229px`, `260px` (exact)
- [ ] **Desktop (>=1320px):** Slider auto-play works
- [ ] **Desktop (>=1320px):** Navigation buttons appear on hover
- [ ] **Tablet (768-1023px):** Layout stacks vertically
- [ ] **Mobile (<768px):** Full width slider
- [ ] **Mobile (<768px):** Images maintain aspect ratios
- [ ] **Mobile (<768px):** Touch navigation works

### Featured Products
- [ ] **Desktop (>=1320px):** Shows exactly 4 products
- [ ] **Desktop (>=1320px):** 2 products per row (2 rows)
- [ ] **Desktop (>=1320px):** Product card width: `312px` (exact)
- [ ] **Desktop (>=1320px):** Spacing matches original design
- [ ] **Desktop (>=1320px):** Hover effects work (scale, shadow)
- [ ] **Desktop (>=1320px):** "Add to Cart" button appears on hover
- [ ] **Tablet (768-1023px):** 2 products per row
- [ ] **Mobile (<768px):** 1 product per row (full width)
- [ ] **Mobile (<768px):** Cards stack vertically
- [ ] **Mobile (<768px):** Touch interactions work

### Best Selling
- [ ] **Desktop (>=1320px):** Shows exactly 4 products
- [ ] **Desktop (>=1320px):** 2 products per row (2 rows)
- [ ] **Desktop (>=1320px):** Product card width: `312px` (exact)
- [ ] **Desktop (>=1320px):** Spacing matches original design
- [ ] **Desktop (>=1320px):** Hover effects work
- [ ] **Tablet (768-1023px):** 2 products per row
- [ ] **Mobile (<768px):** 1 product per row (full width)

### Browse Categories
- [ ] **Desktop (>=1320px):** 6 categories in one row
- [ ] **Desktop (>=1320px):** Category image height: `160px` (h-40)
- [ ] **Desktop (>=1320px):** Font size: `text-3xl` (exact)
- [ ] **Tablet (768-1023px):** 3 categories per row
- [ ] **Mobile (<768px):** 2 categories per row
- [ ] **Mobile (<768px):** Touch targets >= 44px
- [ ] **All sizes:** Hover effects work

### Promo Banners
- [ ] **Desktop (>=1320px):** Card height: `529px` (exact)
- [ ] **Desktop (>=1320px):** Text width: `550px` (exact)
- [ ] **Desktop (>=1320px):** Image width: `655px` (exact)
- [ ] **Desktop (>=1320px):** Font size: `text-4xl` (exact)
- [ ] **Desktop (>=1320px):** Countdown timer works
- [ ] **Desktop (>=1320px):** Slider auto-plays
- [ ] **Tablet (768-1023px):** Layout stacks vertically
- [ ] **Mobile (<768px):** Full width layout
- [ ] **Mobile (<768px):** Text readable
- [ ] **Mobile (<768px):** Touch navigation works

### Features Section
- [ ] **Desktop (>=1320px):** 4 feature cards in one row
- [ ] **Desktop (>=1320px):** Card width: `312px` (exact)
- [ ] **Desktop (>=1320px):** Padding: `p-8` (exact)
- [ ] **Tablet (768-1023px):** 2 cards per row
- [ ] **Mobile (<768px):** 1 card per row (full width)
- [ ] **All sizes:** Icons visible and properly sized

### Footer
- [ ] **Desktop (>=1320px):** 4 columns layout unchanged
- [ ] **Desktop (>=1320px):** All sections visible
- [ ] **Desktop (>=1320px):** Social media icons work
- [ ] **Desktop (>=1320px):** Newsletter form works
- [ ] **Tablet (768-1023px):** Columns stack appropriately
- [ ] **Mobile (<768px):** All columns stack vertically
- [ ] **Mobile (<768px):** Links accessible
- [ ] **Mobile (<768px):** Touch targets >= 44px

## Interaction Testing

### Hover States (Desktop Only)
- [ ] Product cards: Scale and shadow on hover
- [ ] Product cards: "Add to Cart" button appears
- [ ] Category cards: Shadow on hover
- [ ] Navigation links: Opacity change on hover
- [ ] Buttons: Background color change on hover
- [ ] Hero slider: Navigation buttons appear on hover

### Touch Interactions (Mobile)
- [ ] All buttons respond to touch
- [ ] Sliders swipeable
- [ ] Modals open/close with touch
- [ ] Dropdowns work with touch
- [ ] No accidental clicks (proper spacing)

### Keyboard Navigation
- [ ] Tab order logical
- [ ] Focus states visible
- [ ] All interactive elements accessible
- [ ] Modals close with Escape key
- [ ] Forms submit with Enter key

## Performance Testing

- [ ] Page load time < 3 seconds
- [ ] No layout shift (CLS)
- [ ] Images load appropriately
- [ ] No console errors
- [ ] No broken images
- [ ] Smooth scrolling
- [ ] Smooth transitions

## Accessibility Testing

- [ ] All images have alt text
- [ ] All buttons have aria-labels
- [ ] Color contrast meets WCAG AA
- [ ] Text readable at all sizes
- [ ] Focus indicators visible
- [ ] Screen reader compatible
- [ ] Touch targets >= 44px

## Browser Compatibility

Test in:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Edge Cases

- [ ] Very wide screen (>1920px): Content centered, max-width 1320px
- [ ] Very narrow screen (<320px): No horizontal scroll
- [ ] Landscape mobile: Layout works
- [ ] Portrait tablet: Layout works
- [ ] Rotating device: Layout adapts
- [ ] Slow network: Images load gracefully
- [ ] No JavaScript: Basic layout works

## Acceptance Criteria

### Must Pass (Critical)
- [x] FeaturedProducts: 2 per row, 4 total on homepage
- [x] BestSelling: 2 per row, 4 total on homepage
- [ ] Header unchanged at 1320px
- [ ] Hero unchanged at 1320px
- [ ] Footer unchanged at 1320px
- [ ] All hover states preserved at 1320px
- [ ] No visual differences at 1320px vs current design

### Should Pass (Important)
- [ ] Mobile navigation functional
- [ ] Touch targets >= 44px
- [ ] All images load correctly
- [ ] No console errors
- [ ] Smooth transitions

### Nice to Have (Optional)
- [ ] Animations smooth on low-end devices
- [ ] Perfect pixel match at all breakpoints
- [ ] Zero layout shift

## Screenshot Checklist

For each test width, capture:
1. Full homepage screenshot
2. Header close-up
3. Hero section
4. Featured Products section
5. Best Selling section
6. Footer section

Store screenshots in: `src/app/client/qa-screenshots/`

## Notes
- Compare 1320px screenshots with current production design
- Any visual differences at 1320px must be documented and justified
- Mobile experience should be intuitive and touch-friendly
- Desktop experience must remain pixel-perfect



