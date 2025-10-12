/**
 * @fileoverview Seller Dashboard page
 * Main dashboard for seller users
 * 
 * @description This page displays:
 * - Sales analytics and metrics
 * - Product management
 * - Order management
 * - Performance insights
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
import { TrendingUp, Package, DollarSign, Users, Plus, Eye, Edit, Trash2 } from 'lucide-react';

/**
 * Seller Dashboard component
 * 
 * @description Renders the main dashboard for seller users with:
 * - Sales analytics and metrics
 * - Product management tools
 * - Order management
 * - Performance insights
 * 
 * @returns JSX dashboard element
 */
export default function SellerDashboard() {
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
      user={sampleUsers[1]} // Seller user
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
            Seller Dashboard 📊
          </h1>
          <p className="text-gray-600">
            Manage your products, track sales, and grow your business.
          </p>
        </div>

        {/* Sales Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <DollarSign className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-gray-900">$12,450</h3>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-xs text-green-600 mt-1">+12% from last month</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Package className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-gray-900">156</h3>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-xs text-green-600 mt-1">+8% from last month</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <TrendingUp className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-gray-900">24</h3>
              <p className="text-sm text-gray-600">Active Products</p>
              <p className="text-xs text-green-600 mt-1">+3 this week</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-gray-900">89</h3>
              <p className="text-sm text-gray-600">New Customers</p>
              <p className="text-xs text-green-600 mt-1">+15% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Plus className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Add New Product</h3>
                  <p className="text-sm text-gray-600">Create a new product listing</p>
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
                  <h3 className="font-semibold text-gray-900">Manage Orders</h3>
                  <p className="text-sm text-gray-600">Process and track orders</p>
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
                  <h3 className="font-semibold text-gray-900">View Analytics</h3>
                  <p className="text-sm text-gray-600">Sales and performance data</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Orders</h2>
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
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #ORD-001
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        John Doe
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        $199.99
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <Edit className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #ORD-002
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Jane Smith
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        $299.99
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          Shipped
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <Edit className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* My Products */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Products</h2>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleProducts.slice(0, 6).map((product) => (
              <Card key={product.id} className="relative">
                <CardContent className="p-4">
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <button className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200">
                      <Eye className="h-3 w-3" />
                    </button>
                    <button className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200">
                      <Edit className="h-3 w-3" />
                    </button>
                    <button className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                    <Package className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 truncate">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    ${product.price}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-xs text-gray-500">
                      Stock: {product.stock}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
