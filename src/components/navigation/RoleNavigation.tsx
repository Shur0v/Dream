/**
 * @fileoverview Role-based navigation component
 * Provides quick access to different role dashboards
 * 
 * @description This component:
 * - Shows role-specific navigation options
 * - Provides quick access to dashboards
 * - Handles role-based routing
 * 
 * @author Your Name
 * @version 1.0.0
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Users, Store, Package, Shield } from 'lucide-react';

/**
 * Role Navigation component
 * 
 * @description Renders navigation cards for different user roles
 * Provides quick access to role-specific dashboards
 * 
 * @returns JSX navigation element
 */
export const RoleNavigation: React.FC = () => {
  const roles = [
    {
      id: 'client',
      name: 'Customer',
      description: 'Shop and purchase products',
      icon: Users,
      href: '/client/dashboard',
      color: 'blue',
    },
    {
      id: 'seller',
      name: 'Seller',
      description: 'Sell your products on our platform',
      icon: Store,
      href: '/seller/dashboard',
      color: 'green',
    },
    {
      id: 'reseller',
      name: 'Reseller',
      description: 'Buy in bulk and resell products',
      icon: Package,
      href: '/reseller/dashboard',
      color: 'purple',
    },
    {
      id: 'admin',
      name: 'Admin',
      description: 'Manage the entire platform',
      icon: Shield,
      href: '/admin/dashboard',
      color: 'red',
    },
  ];

  return (
    <div className="py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Choose Your Role
        </h2>
        <p className="text-lg text-gray-600">
          Access role-specific features and dashboards
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {roles.map((role) => {
          const IconComponent = role.icon;
          return (
            <Card key={role.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  role.color === 'blue' ? 'bg-blue-100' :
                  role.color === 'green' ? 'bg-green-100' :
                  role.color === 'purple' ? 'bg-purple-100' :
                  'bg-red-100'
                }`}>
                  <IconComponent className={`h-8 w-8 ${
                    role.color === 'blue' ? 'text-blue-600' :
                    role.color === 'green' ? 'text-green-600' :
                    role.color === 'purple' ? 'text-purple-600' :
                    'text-red-600'
                  }`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {role.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {role.description}
                </p>
                <Link href={role.href}>
                  <Button 
                    className={`w-full ${
                      role.color === 'blue' ? 'bg-blue-600 hover:bg-blue-700' :
                      role.color === 'green' ? 'bg-green-600 hover:bg-green-700' :
                      role.color === 'purple' ? 'bg-purple-600 hover:bg-purple-700' :
                      'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    Access Dashboard
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default RoleNavigation;
