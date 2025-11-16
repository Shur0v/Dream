'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Eye, X, Check, Trash2 } from 'lucide-react';
import OrderDetailModal from './OrderDetailModal';
import DeleteConfirmationModal from '../ui/DeleteConfirmationModal';

// Order data structure matching checkout form data
export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
}

export interface Order {
  id: string;
  orderId: string;
  items: OrderItem[];
  customerInfo: {
    name: string;
    phoneNumber: string;
    email: string;
    district: string;
    upazila: string;
    thana: string;
    postOffice: string;
  };
  totalAmount: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

// Mock orders data
const mockOrders: Order[] = [
  {
    id: '1',
    orderId: 'ORD-2024-001',
    items: [
      {
        id: '1',
        productId: 'prod-1',
        name: 'Premium Wireless Headphones',
        image: '/common/cart/image1.png',
        price: 89.99,
        quantity: 2,
        color: 'Black',
        size: 'Standard'
      },
      {
        id: '2',
        productId: 'prod-2',
        name: 'Smart Watch Series 8',
        image: '/common/cart/image2.jpg',
        price: 299.99,
        quantity: 1,
        color: 'Silver',
        size: '42mm'
      }
    ],
    customerInfo: {
      name: 'John Doe',
      phoneNumber: '+8801712345678',
      email: 'john.doe@example.com',
      district: 'Dhaka',
      upazila: 'Dhanmondi',
      thana: 'Dhanmondi',
      postOffice: 'Dhanmondi'
    },
    totalAmount: 479.97,
    status: 'pending',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    orderId: 'ORD-2024-002',
    items: [
      {
        id: '3',
        productId: 'prod-3',
        name: 'Gaming Mechanical Keyboard',
        image: '/common/cart/image3.png',
        price: 149.99,
        quantity: 1,
        color: 'RGB',
        size: 'Full Size'
      }
    ],
    customerInfo: {
      name: 'Jane Smith',
      phoneNumber: '+8801812345678',
      email: 'jane.smith@example.com',
      district: 'Chittagong',
      upazila: 'Agrabad',
      thana: 'Agrabad',
      postOffice: 'Agrabad'
    },
    totalAmount: 149.99,
    status: 'pending',
    createdAt: '2024-01-16T14:20:00Z'
  },
  {
    id: '3',
    orderId: 'ORD-2024-003',
    items: [
      {
        id: '4',
        productId: 'prod-4',
        name: 'Wireless Mouse Pro',
        image: '/common/cart/image4.png',
        price: 79.99,
        quantity: 3,
        color: 'White',
        size: 'Standard'
      },
      {
        id: '5',
        productId: 'prod-5',
        name: 'USB-C Hub Adapter',
        image: '/common/cart/image5.jpg',
        price: 45.99,
        quantity: 2,
        color: 'Silver',
        size: 'Standard'
      }
    ],
    customerInfo: {
      name: 'Ahmed Rahman',
      phoneNumber: '+8801912345678',
      email: 'ahmed.rahman@example.com',
      district: 'Sylhet',
      upazila: 'Sylhet Sadar',
      thana: 'Sylhet Sadar',
      postOffice: 'Sylhet Sadar'
    },
    totalAmount: 331.95,
    status: 'pending',
    createdAt: '2024-01-17T09:15:00Z'
  }
];

/**
 * Orders Table Component
 * Displays orders in a table with product details, color, size, and action buttons
 */
export default function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [orderToReject, setOrderToReject] = useState<Order | null>(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const handleRejectClick = (order: Order) => {
    setOrderToReject(order);
    setIsRejectModalOpen(true);
  };

  const handleRejectConfirm = () => {
    if (orderToReject) {
      setOrders(prev => prev.map(order => 
        order.id === orderToReject.id 
          ? { ...order, status: 'rejected' as const }
          : order
      ));
      setIsRejectModalOpen(false);
      setOrderToReject(null);
    }
  };

  const handleAcceptOrder = (orderId: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: 'accepted' as const }
        : order
    ));
    setIsDetailModalOpen(false);
    setSelectedOrder(null);
  };

  const handleDeleteClick = (order: Order) => {
    setOrderToDelete(order);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (orderToDelete) {
      setOrders(prev => prev.filter(order => order.id !== orderToDelete.id));
      setIsDeleteModalOpen(false);
      setOrderToDelete(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      accepted: 'bg-green-100 text-green-800 border-green-300',
      rejected: 'bg-red-100 text-red-800 border-red-300'
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Product Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Color / Size
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">{order.orderId}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {item.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              ৳{item.price.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      {order.items.map((item) => (
                        <div key={item.id} className="text-sm text-gray-700">
                          {item.color && <div>Color: <span className="font-medium">{item.color}</span></div>}
                          {item.size && <div>Size: <span className="font-medium">{item.size}</span></div>}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      {order.items.map((item) => (
                        <div key={item.id} className="text-sm text-gray-700">
                          {item.quantity}x
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      ৳{order.totalAmount.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewDetails(order)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      {order.status === 'pending' && (
                        <button
                          onClick={() => handleRejectClick(order)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Reject Order"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                      {order.status === 'rejected' && (
                        <button
                          onClick={() => handleDeleteClick(order)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Order"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedOrder(null);
          }}
          order={selectedOrder}
          onAcceptOrder={handleAcceptOrder}
        />
      )}

      {/* Reject Confirmation Modal */}
      {orderToReject && (
        <DeleteConfirmationModal
          isOpen={isRejectModalOpen}
          onClose={() => {
            setIsRejectModalOpen(false);
            setOrderToReject(null);
          }}
          onConfirm={handleRejectConfirm}
          title="Reject Order"
          message={`Are you sure you want to reject order ${orderToReject.orderId}? This action cannot be undone.`}
          confirmButtonText="Reject"
        />
      )}

      {/* Delete Confirmation Modal */}
      {orderToDelete && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setOrderToDelete(null);
          }}
          onConfirm={handleDeleteConfirm}
          title="Delete Order"
          message={`Are you sure you want to permanently delete order ${orderToDelete.orderId}? This action cannot be undone.`}
        />
      )}
    </>
  );
}

