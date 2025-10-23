# Header Scroll Animation

This implementation provides a smooth scroll-based header animation system that can be used across all pages in your application.

## Features

- **Scroll Detection**: Automatically detects scroll direction (up/down)
- **Smooth Animations**: TopBar and BottomNav slide in/out with smooth transitions
- **Always Visible MainHeader**: The main navigation remains visible during scroll
- **Performance Optimized**: Throttled scroll events for smooth performance
- **Responsive**: Works on all device sizes

## How It Works

1. **At Page Top**: All header sections (TopBar, MainHeader, BottomNav) are visible
2. **Scrolling Down**: TopBar slides up and BottomNav slides down, only MainHeader remains visible
3. **Scrolling Up**: TopBar and BottomNav slide back into view
4. **Smooth Transitions**: 300ms ease-in-out animations for all movements

## Usage

### Basic Implementation

```tsx
import Header from '../components/layout/Header';

export const YourPage = () => {
  return (
    <div>
      <Header
        user={user}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        onSearch={handleSearch}
        onCartClick={handleCartClick}
        onWishlistClick={handleWishlistClick}
        onUserAction={handleUserAction}
        onOpenLoginModal={handleOpenLoginModal}
        onOpenRegisterModal={handleOpenRegisterModal}
      />
      
      {/* Your page content */}
      <main>
        {/* Content here */}
      </main>
    </div>
  );
};
```

### Required Props

- `user`: Current user data (optional)
- `cartCount`: Number of items in cart (default: 0)
- `wishlistCount`: Number of items in wishlist (default: 0)

### Optional Callback Props

- `onSearch`: Called when search is performed
- `onCartClick`: Called when cart is clicked
- `onWishlistClick`: Called when wishlist is clicked
- `onUserAction`: Called when user menu action is performed
- `onOpenLoginModal`: Called when login modal should open
- `onOpenRegisterModal`: Called when register modal should open

## Customization

### Scroll Sensitivity

The scroll detection can be customized by modifying the hook parameters:

```tsx
// In Header.tsx
const { scrollDirection, isAtTop } = useScrollDirection(10, 100);
//                                                      ^   ^
//                                                      |   |
//                                              threshold  throttleMs
```

- **threshold**: Minimum scroll distance to trigger direction change (default: 10px)
- **throttleMs**: Throttle interval for scroll events (default: 100ms)

### Animation Duration

Modify the CSS classes in Header.tsx:

```tsx
className={`transition-transform duration-300 ease-in-out ${
  shouldShowTopBar ? 'translate-y-0' : '-translate-y-full'
}`}
```

Change `duration-300` to `duration-200` for faster animations or `duration-500` for slower ones.

## Technical Details

### Files Modified

1. **`src/hooks/useScrollDirection.ts`**: Custom hook for scroll detection
2. **`src/components/layout/Header.tsx`**: Updated with scroll animations
3. **`src/examples/ExamplePageWithHeader.tsx`**: Usage example

### CSS Classes Used

- `transition-transform`: Enables smooth transform animations
- `duration-300`: Sets animation duration to 300ms
- `ease-in-out`: Provides smooth acceleration/deceleration
- `translate-y-0`: Normal position
- `translate-y-full`: Slides element completely out of view
- `-translate-y-full`: Slides element up and out of view

### Performance Considerations

- Scroll events are throttled to prevent excessive re-renders
- Uses `passive: true` for better scroll performance
- Transform animations are GPU-accelerated
- Minimal DOM manipulation during scroll

## Browser Support

- Modern browsers with CSS3 transform support
- Mobile browsers with touch scroll support
- Graceful degradation for older browsers

## Testing

To test the scroll functionality:

1. Load any page with the Header component
2. Scroll down slowly - TopBar and BottomNav should hide
3. Scroll up - TopBar and BottomNav should reappear
4. Scroll to the very top - all sections should be visible
5. Test on mobile devices for touch scroll behavior

## Troubleshooting

### Header Not Animating

- Check if `useScrollDirection` hook is properly imported
- Verify CSS classes are not being overridden
- Ensure the page has enough content to scroll

### Performance Issues

- Increase throttle interval if experiencing lag
- Check for conflicting scroll event listeners
- Verify CSS animations are not causing layout thrashing

### Mobile Issues

- Test touch scroll behavior
- Check viewport meta tag is properly set
- Verify touch-action CSS properties
