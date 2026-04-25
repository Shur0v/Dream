'use client';

import React, { useEffect, useMemo, useState } from 'react';
import MainLayout from '../../../components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Users, Package, DollarSign, TrendingUp } from 'lucide-react';

type DashboardResponse = {
  totalRevenue: number;
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  recentOrders: any[];
};

type UserRow = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isEmailVerified: boolean;
  createdAt: string;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardResponse | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          fetch('/api/admin/dashboard', { cache: 'no-store' }),
          fetch('/api/users', { cache: 'no-store' }),
        ]);

        const statsJson = await statsRes.json();
        const usersJson = await usersRes.json();

        if (!mounted) return;

        setStats(statsJson?.data || null);
        setUsers(Array.isArray(usersJson?.data) ? usersJson.data : []);
      } catch (error) {
        console.error('Admin dashboard load error:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const recentUsers = useMemo(() => {
    return [...users]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);
  }, [users]);

  return (
    <MainLayout user={null} cartCount={0} wishlistCount={0}>
      <div className="py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Live platform metrics and user management data.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-gray-900">{loading ? '...' : users.length}</h3>
              <p className="text-sm text-gray-600">Total Users</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Package className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-gray-900">{loading ? '...' : stats?.totalProducts ?? 0}</h3>
              <p className="text-sm text-gray-600">Active Products</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <DollarSign className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-gray-900">?{loading ? '...' : (stats?.totalRevenue ?? 0).toFixed(2)}</h3>
              <p className="text-sm text-gray-600">Revenue</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <TrendingUp className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-gray-900">{loading ? '...' : stats?.pendingOrders ?? 0}</h3>
              <p className="text-sm text-gray-600">Pending Orders</p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Users</h2>
            <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">Refresh</Button>
          </div>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentUsers.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.role}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {user.isEmailVerified ? 'Verified' : 'Pending'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                    {!loading && recentUsers.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-6 text-center text-gray-500">No users found.</td>
                      </tr>
                    )}
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

