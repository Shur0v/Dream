'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Eye, X, Check, Trash2, RefreshCw } from 'lucide-react';
import OrderDetailModal from './OrderDetailModal';
import DeleteConfirmationModal from '../ui/DeleteConfirmationModal';
import Pagination from '../ui/Pagination';
import { Order as ApiOrder } from '@/types';
import { getApiUrl } from '@/lib/apiConfig';

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

/**
 * Transform API Order to OrdersTable Order format
 */
function transformApiOrderToTableOrder(apiOrder: ApiOrder): Order {
  // Parse customer info from notes if available
  let customerInfo = {
    name: 'Unknown',
    phoneNumber: 'N/A',
    email: 'N/A',
    district: apiOrder.shippingAddress?.city || 'N/A',
    upazila: 'N/A',
    thana: 'N/A',
    postOffice: apiOrder.shippingAddress?.zipCode || 'N/A',
  };

  if (apiOrder.notes) {
    try {
      const notesData = JSON.parse(apiOrder.notes);
      customerInfo = {
        name: notesData.customerName || customerInfo.name,
        phoneNumber: notesData.phoneNumber || customerInfo.phoneNumber,
        email: notesData.email || customerInfo.email,
        district: notesData.district || customerInfo.district,
        upazila: notesData.upazila || customerInfo.upazila,
        thana: notesData.thana || customerInfo.thana,
        postOffice: notesData.postOffice || customerInfo.postOffice,
      };
    } catch (e) {
      // If parsing fails, use default values
      console.warn('Failed to parse order notes:', e);
    }
  }

  // Transform order items
  const transformedItems = apiOrder.items.map((item, index) => ({
    id: item.id || `item-${index}`,
    productId: item.productId,
    name: item.product?.name || 'Unknown Product',
    image: item.product?.images?.[0] || '/placeholder-image.png',
    price: item.price || 0,
    quantity: item.quantity || 1,
    color: item.color,
    size: item.size,
  }));

  // Map API status to table status
  const statusMap: Record<string, 'pending' | 'accepted' | 'rejected'> = {
    pending: 'pending',
    confirmed: 'accepted',
    approved: 'accepted',
    rejected: 'rejected',
    shipped: 'accepted',
    delivered: 'accepted',
    cancelled: 'rejected',
    refunded: 'rejected',
  };

  return {
    id: apiOrder.id,
    orderId: `ORD-${apiOrder.id.slice(-8).padStart(8, '0')}`,
    items: transformedItems,
    customerInfo: customerInfo,
    totalAmount: apiOrder.totalAmount || 0,
    status: statusMap[apiOrder.status] || 'pending',
    createdAt: apiOrder.createdAt,
  };
}

/**
 * Orders Table Component
 * Displays orders in a table with product details, color, size, and action buttons
 */
export default function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [orderToReject, setOrderToReject] = useState<Order | null>(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isAccepting, setIsAccepting] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;

  // Fetch orders from API with IndexedDB cache
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Use admin cache for instant loading
      const { getAdminOrders } = await import('@/lib/indexeddb/adminCache');
      const result = await getAdminOrders({
        page: currentPage,
        limit: itemsPerPage,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });
      
      if (result.success && result.data) {
        // Transform API orders to table format
        const transformedOrders = result.data.map((apiOrder: ApiOrder) =>
          transformApiOrderToTableOrder(apiOrder)
        );
        setOrders(transformedOrders);
        
        // Update pagination info
        if (result.pagination) {
          setTotalItems(result.pagination.total);
          setTotalPages(result.pagination.totalPages);
        }
      } else {
        throw new Error('Failed to fetch orders');
      }
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      // Silent error - don't show error message
      setError(null);
      setOrders([]);
      setTotalItems(0);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch on page load or when page/pagination changes
    fetchOrders();
  }, [currentPage, itemsPerPage]);

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const handleRejectClick = (order: Order) => {
    setOrderToReject(order);
    setIsRejectModalOpen(true);
  };

  const handleRejectConfirm = async () => {
    if (orderToReject) {
      try {
        setIsRejecting(true);
        // Update order status via admin API endpoint
        const { getApiUrl } = await import('@/lib/apiConfig');
        const response = await fetch(getApiUrl(`admin/orders/${orderToReject.id}/reject`), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const result = await response.json();

        if (response.ok && result.success) {
          // Invalidate cache so dashboard stats refresh
          const { invalidateAdminOrdersCache } = await import('@/lib/indexeddb/adminCache');
          await invalidateAdminOrdersCache();
          
          // Invalidate client-side IndexedDB cache
          try {
            const { clearClientAPICache } = await import('@/lib/indexeddb/apiCache');
            await clearClientAPICache();
            // Dispatch event to notify client-side components
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new Event('dashboard:invalidate-cache'));
            }
          } catch (e) {
            // Silent fail
          }
          
          // Refresh orders immediately after update
          await fetchOrders();
          setIsRejectModalOpen(false);
          setOrderToReject(null);
        } else {
          throw new Error(result.error || 'Failed to reject order');
        }
      } catch (err) {
        console.error('Error rejecting order:', err);
        alert('Failed to reject order. Please try again.');
      } finally {
        setIsRejecting(false);
      }
    }
  };

  const handleAcceptOrder = async (orderId: string) => {
    try {
      setIsAccepting(orderId);
      // Update order status via admin API endpoint
      const { getApiUrl } = await import('@/lib/apiConfig');
      const order = orders.find(o => o.id === orderId);
      
      if (!order) return;

      const response = await fetch(getApiUrl(`admin/orders/${orderId}/approve`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Invalidate cache so dashboard stats refresh
        const { invalidateAdminOrdersCache } = await import('@/lib/indexeddb/adminCache');
        await invalidateAdminOrdersCache();
        
        // Invalidate client-side IndexedDB cache
        try {
          const { clearClientAPICache } = await import('@/lib/indexeddb/apiCache');
          await clearClientAPICache();
          // Dispatch event to notify client-side components
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('dashboard:invalidate-cache'));
          }
        } catch (e) {
          // Silent fail
        }
        
        // Refresh orders immediately after update
        await fetchOrders();
        setIsDetailModalOpen(false);
        setSelectedOrder(null);
      } else {
        throw new Error(result.error || 'Failed to update order');
      }
    } catch (err) {
      console.error('Error accepting order:', err);
      alert('Failed to accept order. Please try again.');
    } finally {
      setIsAccepting(null);
    }
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

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex justify-center items-center">
          <div className="text-gray-600">Loading orders...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex justify-center items-center">
          <div className="text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex justify-center items-center">
          <div className="text-gray-600">No orders found</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Orders</h2>
          <button
            onClick={fetchOrders}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer transition-colors"
            title="Refresh orders"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
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
                              unoptimized={item.image.startsWith('http://') || item.image.startsWith('https://') || item.image.startsWith('blob:')}
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
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      {order.status === 'pending' && (
                        <button
                          onClick={() => handleRejectClick(order)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Reject Order"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                      {order.status === 'rejected' && (
                        <button
                          onClick={() => handleDeleteClick(order)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
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
        
        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => {
            if (!isAccepting) {
              setIsDetailModalOpen(false);
              setSelectedOrder(null);
            }
          }}
          order={selectedOrder}
          onAcceptOrder={handleAcceptOrder}
          isAccepting={isAccepting === selectedOrder.id}
        />
      )}

      {/* Reject Confirmation Modal */}
      {orderToReject && (
        <DeleteConfirmationModal
          isOpen={isRejectModalOpen}
          onClose={() => {
            if (!isRejecting) {
              setIsRejectModalOpen(false);
              setOrderToReject(null);
            }
          }}
          onConfirm={handleRejectConfirm}
          title="Reject Order"
          message={`Are you sure you want to reject order ${orderToReject.orderId}? This action cannot be undone.`}
          confirmButtonText="Reject"
          isLoading={isRejecting}
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

