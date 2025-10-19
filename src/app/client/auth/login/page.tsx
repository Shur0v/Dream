/**
 * @fileoverview Customer login page
 * Page for customers to sign in
 * 
 * @description This page includes:
 * - Customer login form
 * - Link to customer registration
 * - Password recovery
 * 
 * @author Your Name
 * @version 1.0.0
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { ShoppingBag, Mail, Lock } from 'lucide-react';

/**
 * Customer Login page component
 * 
 * @description Renders the customer login page with:
 * - Login form
 * - Link to customer registration
 * - Remember me option
 * 
 * @returns JSX customer login page element
 */
export default function CustomerLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Customer login:', formData);
    // TODO: Implement customer login logic
    // On success, redirect to /client/dashboard
    window.location.href = '/client/dashboard';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <ShoppingBag className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Customer Login
          </h1>
          <p className="text-lg text-gray-600">
            Sign in to your account
          </p>
        </div>

        {/* Login Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="email"
                    name="email"
                    placeholder="customer@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Remember me</span>
                </label>
                <Link 
                  href="/client/auth/forgot-password" 
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                size="lg"
              >
                Sign In
              </Button>
            </form>

            {/* Registration Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link 
                  href="/client/auth/register" 
                  className="font-semibold text-blue-600 hover:text-blue-700"
                >
                  Register here
                </Link>
              </p>
            </div>

            {/* Other Login Options */}
            <div className="mt-6 border-t pt-6">
              <p className="text-sm text-gray-600 text-center mb-4">
                Are you a:
              </p>
              <div className="flex flex-col gap-2">
                <Link 
                  href="/seller/login" 
                  className="text-sm text-green-600 hover:text-green-700 text-center"
                >
                  Seller? Sign in here →
                </Link>
                <Link 
                  href="/reseller/login" 
                  className="text-sm text-purple-600 hover:text-purple-700 text-center"
                >
                  Reseller? Sign in here →
                </Link>
              </div>
            </div>

            {/* Back to Home */}
            <div className="mt-4 text-center">
              <Link 
                href="/client/home" 
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                ← Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
