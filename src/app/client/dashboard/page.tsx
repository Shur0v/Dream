/**
 * @fileoverview Client Dashboard page
 * Main dashboard for customer users
 * 
 * @description This page displays:
 * - Welcome message and user info
 * - Recent orders
 * - Wishlist items
 * - Recommended products
 * - Quick actions
 * 
 * @author Your Name
 * @version 1.0.0
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '../../../components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import ProductCard from '../../../components/product/ProductCard';
import { sampleProducts, sampleWishlistItems, sampleUsers } from '../../../lib/dummyData';
import { apiService } from '../../../services/api';
import { ShoppingBag, Heart, Package, User, Settings, Bell } from 'lucide-react';
import Link from 'next/link';

/**
 * Client Dashboard component
 * 
 * @description Renders the main dashboard for customer users with:
 * - User welcome section
 * - Quick stats and actions
 * - Recent orders and wishlist
 * - Recommended products
 * 
 * @returns JSX dashboard element
 */
interface Order {
  id: string;
  status: string;
  totalAmount: number;
  items: Array<any>;
  createdAt: string;
  trackingNumber?: string;
}

export default function ClientDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordersCount, setOrdersCount] = useState(0);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await apiService.getOrders();
      if (response.success && response.data) {
        const ordersList = response.data as Order[];
        setOrders(ordersList);
        setOrdersCount(ordersList.length);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle search functionality
   */
  const handleSearch = (query: string) => {
    console.log('Search query:', query);
  };

  /**
   * Handle cart click
   */
  const handleCartClick = () => {
    console.log('Cart clicked');
  };

  /**
   * Handle wishlist click
   */
  const handleWishlistClick = () => {
    console.log('Wishlist clicked');
  };

  /**
   * Handle user actions
   */
  const handleUserAction = (action: string) => {
    console.log('User action:', action);
  };

  /**
   * Handle newsletter subscription
   */
  const handleNewsletterSubscribe = (email: string) => {
    console.log('Newsletter subscription:', email);
  };

  /**
   * Handle add to cart
   */
  const handleAddToCart = (product: any) => {
    console.log('Add to cart:', product);
  };

  /**
   * Handle add to wishlist
   */
  const handleAddToWishlist = (product: any) => {
    console.log('Add to wishlist:', product);
  };

  /**
   * Handle product click
   */
  const handleProductClick = (product: any) => {
    console.log('Product clicked:', product);
  };

  return (
    <MainLayout
      user={sampleUsers[0]}
      cartCount={2}
      wishlistCount={3}
      onSearch={handleSearch}
      onCartClick={handleCartClick}
      onWishlistClick={handleWishlistClick}
      onUserAction={handleUserAction}
      onNewsletterSubscribe={handleNewsletterSubscribe}
    >
      {/* Welcome Section */}
      <div className="py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, John! 👋
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your orders and recommendations.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Package className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-gray-900">
                {loading ? '...' : orders.filter(o => ['pending', 'confirmed', 'shipped'].includes(o.status)).length}
              </h3>
              <p className="text-sm text-gray-600">Active Orders</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-gray-900">5</h3>
              <p className="text-sm text-gray-600">Wishlist Items</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <ShoppingBag className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-gray-900">{loading ? '...' : ordersCount}</h3>
              <p className="text-sm text-gray-600">Total Orders</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Bell className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-gray-900">3</h3>
              <p className="text-sm text-gray-600">Notifications</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/client/delivery">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Track Orders</h3>
                    <p className="text-sm text-gray-600">Check your order status</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Heart className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">My Wishlist</h3>
                  <p className="text-sm text-gray-600">View saved items</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Profile Settings</h3>
                  <p className="text-sm text-gray-600">Manage your account</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Orders</h2>
            <Link href="/client/delivery">
              <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">
                View All Orders
              </Button>
            </Link>
          </div>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No orders yet</p>
              <Link href="/client/categories">
                <Button className="bg-purple-600 text-white hover:bg-purple-700">
                  Start Shopping
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {orders.slice(0, 2).map((order) => (
                <Link key={order.id} href={`/client/delivery?orderId=${order.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">Order #{order.id.slice(-8)}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'confirmed' ? 'bg-purple-100 text-purple-800' :
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                          Total: ৳{order.totalAmount.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Ordered: {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        {order.trackingNumber && (
                          <p className="text-sm text-gray-600">
                            Tracking: {order.trackingNumber}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recommended Products */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recommended for You</h2>
            <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">
              View All Products
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sampleProducts.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
                onProductClick={handleProductClick}
              />
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
