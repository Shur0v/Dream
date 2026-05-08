# Dream Store - Professional E-Commerce Platform

A modern, full-featured e-commerce web application built with Next.js, TypeScript, Redux Toolkit, and Tailwind CSS. This platform supports multiple user roles and provides a complete shopping experience.

## 🚀 Features

### Core Features
- **Multi-Role Support**: Client, Seller, Reseller, and Super Admin roles
- **Product Management**: Full CRUD operations for products
- **Shopping Cart**: Add, remove, and manage cart items
- **Wishlist**: Save favorite products for later
- **User Authentication**: Secure login/registration system
- **Order Management**: Complete order lifecycle
- **Responsive Design**: Mobile-first, responsive UI

### Technical Features
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Redux Toolkit** for state management
- **Redux Persist** for state persistence
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Axios** for API calls
- **Custom Hooks** for reusable logic

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── products/     # Product management
│   │   ├── cart/         # Shopping cart
│   │   ├── orders/       # Order management
│   │   └── users/        # User management
│   ├── store.ts          # Redux store configuration
│   ├── ReduxProvider.tsx # Redux provider wrapper
│   └── layout.tsx        # Root layout
├── components/            # Reusable UI components
│   ├── ui/               # Basic UI components (Button, Input, Card)
│   ├── layout/           # Layout components (Header, Footer, MainLayout)
│   ├── forms/            # Form components
│   ├── product/          # Product-related components
│   └── cart/             # Cart components
├── features/             # Redux feature slices
│   ├── auth/             # Authentication state
│   ├── cart/             # Shopping cart state
│   ├── products/         # Products state
│   ├── user/             # User profile state
│   ├── wishlist/         # Wishlist state
│   └── orders/           # Orders state
├── pages/                # Page components
│   ├── auth/             # Authentication pages
│   ├── client/           # Client-specific pages
│   ├── seller/           # Seller dashboard pages
│   ├── reseller/         # Reseller pages
│   └── admin/            # Admin panel pages
├── hooks/                # Custom React hooks
├── services/             # API service functions
├── lib/                  # Utility functions and configurations
├── types/                # TypeScript type definitions
└── assets/               # Static assets (images, icons)
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dream-store
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3001](http://localhost:3001)

## 🎯 User Roles

### Client (Customer)
- Browse and search products
- Add items to cart and wishlist
- Place orders and track shipments
- Manage profile and addresses

### Seller
- Create and manage product listings
- View sales analytics
- Manage inventory
- Process orders

### Reseller
- Access bulk pricing
- Manage wholesale orders
- View reseller dashboard
- Access special promotions

### Super Admin
- Manage all users and roles
- Oversee platform operations
- Access analytics and reports
- Manage system settings

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Products
- `GET /api/products` - List products (with filtering)
- `GET /api/products/[id]` - Get single product
- `POST /api/products` - Create product (seller/admin)
- `PUT /api/products/[id]` - Update product (seller/admin)
- `DELETE /api/products/[id]` - Delete product (admin)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart` - Update cart item quantity
- `DELETE /api/cart` - Remove item from cart

### Orders
- `GET /api/orders` - Get user's orders
- `GET /api/orders/[id]` - Get single order
- `POST /api/orders` - Create new order

## 🎨 UI Components

### Basic Components
- **Button**: Multiple variants (primary, secondary, outline, ghost)
- **Input**: Form inputs with validation states
- **Card**: Content containers with multiple styles

### Layout Components
- **Header**: Navigation with search, cart, and user menu
- **Footer**: Links, newsletter signup, and social media
- **MainLayout**: Wrapper component for all pages

### Product Components
- **ProductCard**: Product display with actions
- **ProductList**: Grid layout for multiple products
- **ProductDetails**: Detailed product view

## 🔄 State Management

The application uses Redux Toolkit for state management with the following slices:

- **auth**: User authentication state
- **cart**: Shopping cart items and totals
- **products**: Product catalog and filters
- **user**: User profile information
- **wishlist**: Saved products
- **orders**: Order history and details

## 🎯 Custom Hooks

- **useApi**: API calls with loading and error states
- **useForm**: Form handling with validation
- **useLocalStorage**: Persistent state management
- **useDebounce**: Performance optimization
- **useIntersectionObserver**: Lazy loading and animations

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically on every push

### Other Platforms
- **Netlify**: Static site deployment
- **Railway**: Full-stack deployment
- **AWS**: Custom server deployment

## 📝 Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3001
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Redux Toolkit](https://redux-toolkit.js.org/) - State management
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Lucide React](https://lucide.dev/) - Icon library
- [TypeScript](https://www.typescriptlang.org/) - Type safety

## 📞 Support

For support, email support@dreamstore.com or join our Discord community.

---

**Built with ❤️ by the Dream Store Team**
# Dream
