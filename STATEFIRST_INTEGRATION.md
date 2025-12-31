# State First Payment Integration

This document describes the State First payment API integration for DreamShop.

## API Configuration

The State First payment service has been integrated with the following API keys:

- **API Key**: `yjksy1y0x15x9ysaiuw1eoelqpqbgtii`
- **Secret Key**: `nymohxctr2gbuwk1urpdqxqq`
- **API Documentation**: https://docs.google.com/document/d/e/2PACX-1vTi0sTyR353xu1AK0nR8E_WKe5onCkUXGEf8ch8uoJy9qxGfgGnboSlkNosjQ000dXkJhgGuAsWxnlh/pub

## Environment Variables (Optional)

You can override the API keys and base URL using environment variables:

```env
NEXT_PUBLIC_STATEFIRST_API_KEY=your_api_key
NEXT_PUBLIC_STATEFIRST_SECRET_KEY=your_secret_key
NEXT_PUBLIC_STATEFIRST_API_URL=https://api.statefirst.com
```

## Features Implemented

1. **Payment Service** (`src/services/payment.ts`)
   - State First payment session creation
   - Payment verification
   - Total price calculation

2. **Banner Buy Now Buttons**
   - Calculate product price from banner
   - Redirect to payment checkout
   - Store order data in session

3. **Product Details Buy Now**
   - Calculate total price (price × quantity)
   - Integrate with State First payment
   - Handle checkout form submission

4. **Payment Pages**
   - `/client/payment/checkout` - Payment checkout form
   - `/client/payment/success` - Payment success page with order confirmation
   - `/client/payment/cancel` - Payment cancellation page

5. **Delivery Tracking**
   - `/client/delivery` - Order delivery tracking page
   - Shows order status, items, and delivery address
   - Links to dashboard

6. **Dashboard Integration**
   - Fetches and displays real orders from API
   - Shows order status and details
   - Links to delivery tracking

7. **Footer Contact Information**
   - All social media links with target="_blank"
   - WhatsApp link: wa.me/8801576609601
   - Facebook, Instagram, YouTube, Twitter/X, LinkedIn links

## Payment Flow

1. User clicks "Buy Now" button (banner or product page)
2. System calculates total price
3. User fills checkout form with delivery information
4. Payment session created with State First API
5. User redirected to State First payment page
6. After successful payment, user redirected to success page
7. Order created in database
8. User can view order in dashboard and track delivery

## Important Notes

- The State First API base URL is currently set to `https://api.statefirst.com` as a placeholder. You may need to update this based on the actual State First API documentation.
- All payment-related data is stored in sessionStorage temporarily during the payment process.
- Orders are automatically created in the database after successful payment verification.
- The dashboard fetches orders from the API and displays them in real-time.

## Contact Information in Footer

All contact links in the footer now open in new tabs (target="_blank"):
- Facebook: https://facebook.com/dreamshoplimited/
- Instagram: https://instagram.com/dreamshoplimited/
- YouTube: https://youtube.com/@dreamshoplimited/
- Twitter/X: https://x.com/dreamshopbdltd/
- LinkedIn: https://www.linkedin.com/company/dreamshoplimited/
- WhatsApp: https://wa.me/8801576609601

