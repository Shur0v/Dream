/**
 * @fileoverview Reseller Dashboard page
 * Main dashboard for reseller users
 * 
 * @description This page displays:
 * - Bulk pricing and wholesale options
 * - Inventory management
 * - Order tracking
 * - Reseller-specific features
 * 
 * @author Your Name
 * @version 1.0.0
 */

'use client';

import React from 'react';
import MainLayout from '../../../components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import ProductCard from '../../../components/product/ProductCard';
import { sampleProducts, sampleUsers } from '../../../lib/dummyData';
import { Package, DollarSign, TrendingUp, Users, ShoppingCart, Percent, Truck, Award } from 'lucide-react';

/**
 * Reseller Dashboard component
 * 
 * @description Renders the main dashboard for reseller users with:
 * - Bulk pricing and wholesale options
 * - Inventory management tools
 * - Order tracking and management
 * - Reseller-specific features and benefits
 * 
 * @returns JSX dashboard element
 */
export default function ResellerDashboard() {
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
      user={sampleUsers[2]} // Reseller user
      cartCount={0}
      wishlistCount={0}
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
            Reseller Dashboard 🏪
          </h1>
          <p className="text-gray-600">
            Access wholesale pricing, manage bulk orders, and grow your reseller business.
          </p>
        </div>

        {/* Reseller Benefits Banner */}
        <Card className="mb-8 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold mb-2">Reseller Benefits</h2>
                <p className="text-purple-100">
                  Enjoy exclusive wholesale pricing, bulk discounts, and priority support.
                </p>
              </div>
              <div className="flex space-x-4">
                <div className="text-center">
                  <Percent className="h-8 w-8 mx-auto mb-1" />
                  <p className="text-sm font-semibold">Up to 30% Off</p>
                </div>
                <div className="text-center">
                  <Truck className="h-8 w-8 mx-auto mb-1" />
                  <p className="text-sm font-semibold">Free Shipping</p>
                </div>
                <div className="text-center">
                  <Award className="h-8 w-8 mx-auto mb-1" />
                  <p className="text-sm font-semibold">Priority Support</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reseller Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <DollarSign className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-gray-900">$45,230</h3>
              <p className="text-sm text-gray-600">Total Purchases</p>
              <p className="text-xs text-green-600 mt-1">+18% from last month</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <ShoppingCart className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-gray-900">89</h3>
              <p className="text-sm text-gray-600">Bulk Orders</p>
              <p className="text-xs text-green-600 mt-1">+12% from last month</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Package className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-gray-900">1,245</h3>
              <p className="text-sm text-gray-600">Items Purchased</p>
              <p className="text-xs text-green-600 mt-1">+25% from last month</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <TrendingUp className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-gray-900">28%</h3>
              <p className="text-sm text-gray-600">Average Discount</p>
              <p className="text-xs text-green-600 mt-1">+3% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Place Bulk Order</h3>
                  <p className="text-sm text-gray-600">Order products in bulk</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">View Inventory</h3>
                  <p className="text-sm text-gray-600">Check available products</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Sales Reports</h3>
                  <p className="text-sm text-gray-600">View performance analytics</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Wholesale Products */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Wholesale Products</h2>
            <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">
              View All Products
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sampleProducts.slice(0, 4).map((product) => (
              <Card key={product.id} className="relative">
                <CardContent className="p-4">
                  <div className="absolute top-2 left-2">
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                      Wholesale
                    </span>
                  </div>
                  <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                    <Package className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 truncate">
                    {product.name}
                  </h3>
                  <div className="space-y-1 mb-3">
                    <p className="text-sm text-gray-500 line-through">
                      Retail: ${product.price}
                    </p>
                    <p className="text-lg font-bold text-green-600">
                      Wholesale: ${(product.price * 0.7).toFixed(2)}
                    </p>
                    <p className="text-xs text-green-600">
                      Save 30%
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs text-gray-500">
                      <p>Min Order: 10 units</p>
                      <p>Stock: {product.stock} units</p>
                    </div>
                    <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700">
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Bulk Orders</h2>
            <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">
              View All Orders
            </Button>
          </div>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Products
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #BULK-001
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Electronics Bundle
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        50 units
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        $3,450.00
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          Delivered
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #BULK-002
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Clothing Bundle
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        100 units
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        $2,100.00
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          Processing
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
