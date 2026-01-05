'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { Users } from 'lucide-react';

interface UserData {
  username: string;
  mobile: string;
  email: string;
  loginTime: string;
}

/**
 * Users Page Component
 * Displays all users who signed in to the site
 */
export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load users from MongoDB API
    const loadUsers = async () => {
      try {
        setIsLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${apiUrl}/users`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const result = await response.json();
        
        if (result.success && result.data) {
          // Transform MongoDB user data to UserData format
          const transformedUsers: UserData[] = result.data.map((user: any) => ({
            username: user.firstName || user.email?.split('@')[0] || 'Unknown',
            mobile: user.phone || 'N/A',
            email: user.email || 'N/A',
            loginTime: user.createdAt || user.updatedAt || new Date().toISOString(),
          }));
          
          // Sort by login time (newest first)
          const sortedUsers = transformedUsers.sort((a: UserData, b: UserData) => {
            return new Date(b.loginTime).getTime() - new Date(a.loginTime).getTime();
          });
          
          setUsers(sortedUsers);
        }
      } catch (error: any) {
        console.error('Error loading users:', error);
        if (error.message?.includes('Failed to fetch') || error.message?.includes('ERR_CONNECTION_REFUSED')) {
          setError('Backend server is not running. Please start the backend server with: pnpm backend:dev');
        } else {
          setError('Failed to load users: ' + (error.message || 'Unknown error'));
        }
      } finally {
        setIsLoading(false);
      }
    };

          loadUsers();

          // No auto-refresh - data will only load on component mount or manual refresh
          return () => {
            // Cleanup if needed
          };
  }, []);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <DashboardLayout>
      <div className="w-full p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-fuchsia-600" />
            <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          </div>
          <p className="text-gray-600">View all users who signed in to the site</p>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex justify-center items-center">
              <div className="text-gray-600">Loading users...</div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex justify-center items-center">
              <div className="text-red-600">{error}</div>
            </div>
          </div>
        ) : users.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex justify-center items-center">
              <div className="text-gray-600">No users found</div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Mobile Number
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Email Address
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Sign In Time
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.username}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">{user.mobile}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{formatDate(user.loginTime)}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

