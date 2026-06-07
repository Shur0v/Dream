'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Eye, X, Check, Trash2, RefreshCw } from 'lucide-react';
import OrderDetailModal from './OrderDetailModal';
import DeleteConfirmationModal from '../ui/DeleteConfirmationModal';
import Pagination from '../ui/Pagination';
import SearchableMultiSelect from '../ui/SearchableMultiSelect';
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

type ProductOption = {
  id: string;
  name: string;
  price: number;
  image: string;
};

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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [creatingManualOrder, setCreatingManualOrder] = useState(false);
  const [productOptions, setProductOptions] = useState<ProductOption[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<Array<string | number>>([]);
  const [manualItems, setManualItems] = useState<Array<{ productId: string; quantity: number; color: string; size: string }>>([]);
  const [manualForm, setManualForm] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    district: '',
    upazila: '',
    thana: '',
    postOffice: '',
    status: 'approved',
    paymentMethod: 'Cash on Delivery',
  });
  
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

  const loadProductOptions = async () => {
    try {
      const response = await fetch(getApiUrl('products?limit=1000&sortBy=createdAt&sortOrder=desc'), {
        cache: 'no-store',
      });
      const result = await response.json();
      if (response.ok && result?.success && Array.isArray(result.data)) {
        const options = result.data.map((product: any) => ({
          id: product.id,
          name: product.name || 'Unknown Product',
          price: Number(product.price || 0),
          image: product.images?.[0] || '/placeholder-image.png',
        }));
        setProductOptions(options);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  const openAddModal = async () => {
    await loadProductOptions();
    setSelectedProductIds([]);
    setManualItems([]);
    setManualForm({
      name: '',
      phoneNumber: '',
      email: '',
      district: '',
      upazila: '',
      thana: '',
      postOffice: '',
      status: 'approved',
      paymentMethod: 'Cash on Delivery',
    });
    setIsAddModalOpen(true);
  };

  const manualTotal = manualItems.reduce((sum, row) => {
    const found = productOptions.find((p) => p.id === row.productId);
    return sum + Number(found?.price || 0) * Number(row.quantity || 1);
  }, 0);

  const handleCreateManualOrder = async () => {
    if (!manualForm.name || !manualForm.phoneNumber || !manualForm.district || !manualForm.upazila || !manualForm.thana || !manualForm.postOffice) {
      alert('Please fill all required customer and address fields.');
      return;
    }
    if (manualItems.length === 0) {
      alert('Please select at least one product.');
      return;
    }
    try {
      setCreatingManualOrder(true);
      const payload = {
        customerInfo: {
          name: manualForm.name,
          phoneNumber: manualForm.phoneNumber,
          email: manualForm.email,
          district: manualForm.district,
          upazila: manualForm.upazila,
          thana: manualForm.thana,
          postOffice: manualForm.postOffice,
        },
        items: manualItems.map((row) => ({
          productId: row.productId,
          quantity: row.quantity,
          color: row.color || undefined,
          size: row.size || undefined,
        })),
        status: manualForm.status,
        paymentMethod: manualForm.paymentMethod,
      };
      const response = await fetch(getApiUrl('admin/orders'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok || !result?.success) {
        throw new Error(result?.error || 'Failed to create manual order.');
      }
      const { invalidateAdminOrdersCache } = await import('@/lib/indexeddb/adminCache');
      await invalidateAdminOrdersCache();
      await fetchOrders();
      setIsAddModalOpen(false);
    } catch (error: any) {
      alert(error?.message || 'Failed to create manual order.');
    } finally {
      setCreatingManualOrder(false);
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

  const formatCurrency = (amount: number) => {
    return `৳${amount.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-105">
            <Check className="w-3 h-3 text-emerald-600" />
            Accepted
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-[11px] font-bold border border-rose-105">
            <X className="w-3 h-3 text-rose-600" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-[11px] font-bold border border-amber-105">
            Pending
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-zinc-150/70 shadow-sm overflow-hidden p-8">
        <div className="flex justify-center items-center py-12">
          <div className="text-zinc-400 text-sm font-semibold font-['Poppins'] animate-pulse">
            Loading orders...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-zinc-150/70 shadow-sm overflow-hidden p-8">
        <div className="flex justify-center items-center py-12">
          <div className="text-rose-500 text-sm font-semibold font-['Poppins']">
            Error: {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-zinc-150/70 shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-zinc-100 bg-white">
          <h3 className="text-zinc-800 text-lg font-bold font-['Poppins']">Orders</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white text-xs font-bold tracking-wider uppercase rounded-xl shadow-md shadow-purple-200/50 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer font-['Poppins']"
            >
              <span>Add Order</span>
            </button>
            <button
              onClick={fetchOrders}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2.5 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-600 text-xs font-bold tracking-wider uppercase rounded-xl disabled:bg-zinc-100 disabled:text-zinc-400 disabled:border-zinc-200 disabled:cursor-not-allowed transition-all cursor-pointer font-['Poppins']"
              title="Refresh orders"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="px-6 py-16 text-center bg-white">
            <div className="text-zinc-400 text-sm font-semibold font-['Poppins']">
              No orders found
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto bg-white">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-zinc-50/50 border-b border-zinc-100/80">
                    <th className="px-6 py-4 text-left border-b border-zinc-100/80 bg-zinc-50/50">
                      <div className="text-zinc-400 text-[10px] font-extrabold font-['Poppins'] uppercase tracking-wider">
                        Order ID
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left border-b border-zinc-100/80 bg-zinc-50/50">
                      <div className="text-zinc-400 text-[10px] font-extrabold font-['Poppins'] uppercase tracking-wider">
                        Product Details
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left border-b border-zinc-100/80 bg-zinc-50/50">
                      <div className="text-zinc-400 text-[10px] font-extrabold font-['Poppins'] uppercase tracking-wider">
                        Color / Size
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center border-b border-zinc-100/80 bg-zinc-50/50">
                      <div className="text-zinc-400 text-[10px] font-extrabold font-['Poppins'] uppercase tracking-wider">
                        Quantity
                      </div>
                    </th>
                    <th className="px-6 py-4 text-right border-b border-zinc-100/80 bg-zinc-50/50">
                      <div className="text-zinc-400 text-[10px] font-extrabold font-['Poppins'] uppercase tracking-wider">
                        Total Amount
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center border-b border-zinc-100/80 bg-zinc-50/50">
                      <div className="text-zinc-400 text-[10px] font-extrabold font-['Poppins'] uppercase tracking-wider">
                        Status
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center border-b border-zinc-100/80 bg-zinc-50/50">
                      <div className="text-zinc-400 text-[10px] font-extrabold font-['Poppins'] uppercase tracking-wider">
                        Date
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center border-b border-zinc-100/80 bg-zinc-50/50 w-24">
                      <div className="text-zinc-400 text-[10px] font-extrabold font-['Poppins'] uppercase tracking-wider">
                        Actions
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100/80">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-purple-600 font-mono text-xs font-bold bg-purple-50/60 px-2 py-0.5 rounded-md border border-purple-100/50 inline-block">
                          <code>{order.orderId}</code>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-2">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-3">
                              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-zinc-50 border border-zinc-100 flex-shrink-0">
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  unoptimized={item.image.startsWith('http://') || item.image.startsWith('https://') || item.image.startsWith('blob:')}
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-zinc-800 text-sm font-bold font-['Poppins'] truncate max-w-[200px]">
                                  {item.name}
                                </div>
                                <div className="text-zinc-400 text-xs font-semibold font-['Poppins']">
                                  {formatCurrency(item.price)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          {order.items.map((item) => (
                            <div key={item.id} className="text-xs font-semibold font-['Poppins'] text-zinc-650">
                              {item.color || item.size ? (
                                <div className="flex flex-col gap-0.5">
                                  {item.color && <div>Color: <span className="font-bold text-zinc-800">{item.color}</span></div>}
                                  {item.size && <div>Size: <span className="font-bold text-zinc-800">{item.size}</span></div>}
                                </div>
                              ) : (
                                <span className="text-zinc-400 font-normal">N/A</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex flex-col gap-1 items-center">
                          {order.items.map((item) => (
                            <div key={item.id} className="text-sm font-semibold font-['Poppins'] text-zinc-700">
                              {item.quantity}x
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="inline-flex items-center gap-1 text-zinc-900 text-sm font-black font-['Poppins']">
                          <span className="text-[10px] text-zinc-400 font-bold">BDT</span>
                          <span>{order.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-zinc-500 text-xs font-semibold font-['Poppins']">
                          {formatDate(order.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleViewDetails(order)}
                            className="p-1.5 rounded-xl hover:bg-purple-50 text-purple-600 hover:text-purple-700 border border-transparent hover:border-purple-200/50 transition-all inline-flex items-center justify-center cursor-pointer"
                            title="View Details"
                          >
                            <Eye className="w-4.5 h-4.5" />
                          </button>
                          {order.status === 'pending' && (
                            <button
                              onClick={() => handleRejectClick(order)}
                              className="p-1.5 rounded-xl hover:bg-rose-50 text-rose-600 hover:text-rose-700 border border-transparent hover:border-rose-200/50 transition-all inline-flex items-center justify-center cursor-pointer"
                              title="Reject Order"
                            >
                              <X className="w-4.5 h-4.5" />
                            </button>
                          )}
                          {order.status === 'rejected' && (
                            <button
                              onClick={() => handleDeleteClick(order)}
                              className="p-1.5 rounded-xl hover:bg-rose-50 text-rose-600 hover:text-rose-700 border border-transparent hover:border-rose-200/50 transition-all inline-flex items-center justify-center cursor-pointer"
                              title="Delete Order"
                            >
                              <Trash2 className="w-4.5 h-4.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination wrapped inside container border */}
            {totalItems > 0 && (
              <div className="px-6 py-4 border-t border-zinc-100 bg-white">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  itemsPerPage={itemsPerPage}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </div>
            )}
          </>
        )}
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
          onOrderUpdated={async () => {
            await fetchOrders();
          }}
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

      {isAddModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-zinc-950/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl border border-zinc-150">
            <div className="mb-6 flex items-center justify-between border-b border-zinc-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-zinc-900 font-['Poppins']">Add Manual Order</h3>
                <p className="text-xs text-zinc-450 font-semibold font-['Poppins'] mt-1">Create a new order manually for local customers</p>
              </div>
              <button
                onClick={() => !creatingManualOrder && setIsAddModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 border border-transparent hover:border-zinc-200/50 transition-all inline-flex items-center justify-center cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-zinc-450 font-['Poppins'] uppercase tracking-wider">Customer Name *</label>
                <input className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm font-semibold text-zinc-700 placeholder-zinc-450 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-['Poppins']" placeholder="Customer name *" value={manualForm.name} onChange={(e) => setManualForm((prev) => ({ ...prev, name: e.target.value }))} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-zinc-450 font-['Poppins'] uppercase tracking-wider">Phone Number *</label>
                <input className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm font-semibold text-zinc-700 placeholder-zinc-455 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-['Poppins']" placeholder="Phone number *" value={manualForm.phoneNumber} onChange={(e) => setManualForm((prev) => ({ ...prev, phoneNumber: e.target.value }))} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-zinc-450 font-['Poppins'] uppercase tracking-wider">Email (optional)</label>
                <input className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm font-semibold text-zinc-700 placeholder-zinc-450 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-['Poppins']" placeholder="Email (optional)" value={manualForm.email} onChange={(e) => setManualForm((prev) => ({ ...prev, email: e.target.value }))} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-zinc-450 font-['Poppins'] uppercase tracking-wider">Order Status</label>
                <select className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm font-semibold text-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-['Poppins']" value={manualForm.status} onChange={(e) => setManualForm((prev) => ({ ...prev, status: e.target.value }))}>
                  <option value="approved">Accepted</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-zinc-450 font-['Poppins'] uppercase tracking-wider">District *</label>
                <input className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm font-semibold text-zinc-700 placeholder-zinc-450 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-['Poppins']" placeholder="District *" value={manualForm.district} onChange={(e) => setManualForm((prev) => ({ ...prev, district: e.target.value }))} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-zinc-450 font-['Poppins'] uppercase tracking-wider">Upazila *</label>
                <input className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm font-semibold text-zinc-700 placeholder-zinc-450 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-['Poppins']" placeholder="Upazila *" value={manualForm.upazila} onChange={(e) => setManualForm((prev) => ({ ...prev, upazila: e.target.value }))} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-zinc-450 font-['Poppins'] uppercase tracking-wider">Thana *</label>
                <input className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm font-semibold text-zinc-700 placeholder-zinc-450 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-['Poppins']" placeholder="Thana *" value={manualForm.thana} onChange={(e) => setManualForm((prev) => ({ ...prev, thana: e.target.value }))} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-zinc-450 font-['Poppins'] uppercase tracking-wider">Post office *</label>
                <input className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm font-semibold text-zinc-700 placeholder-zinc-450 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-['Poppins']" placeholder="Post office *" value={manualForm.postOffice} onChange={(e) => setManualForm((prev) => ({ ...prev, postOffice: e.target.value }))} />
              </div>
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-xs font-bold text-zinc-450 font-['Poppins'] uppercase tracking-wider">Payment Method</label>
                <input className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm font-semibold text-zinc-700 placeholder-zinc-450 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-['Poppins']" placeholder="Payment method" value={manualForm.paymentMethod} onChange={(e) => setManualForm((prev) => ({ ...prev, paymentMethod: e.target.value }))} />
              </div>
            </div>

            <div className="mt-6">
              <label className="mb-2 block text-xs font-bold text-zinc-450 font-['Poppins'] uppercase tracking-wider">Select Products (one or multiple)</label>
              <SearchableMultiSelect
                options={productOptions}
                selectedIds={selectedProductIds}
                controlClassName="border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-white"
                onChange={(ids) => {
                  setSelectedProductIds(ids);
                  setManualItems((prev) => {
                    const existingMap = new Map(prev.map((it) => [it.productId, it]));
                    return ids.map((id) => {
                      const key = String(id);
                      const existing = existingMap.get(key);
                      return existing || { productId: key, quantity: 1, color: '', size: '' };
                    });
                  });
                }}
                placeholder="Search and select products"
                searchPlaceholder="Search product by name"
                renderOption={(option) => (
                  <div className="flex items-center gap-2">
                    <div className="relative h-8 w-8 overflow-hidden rounded-md bg-zinc-50 border border-zinc-150 flex-shrink-0">
                      <Image src={option.image} alt={option.name} fill className="object-cover" unoptimized />
                    </div>
                    <span className="text-sm font-semibold text-zinc-700 font-['Poppins']">{option.name}</span>
                    <span className="text-xs text-zinc-450 font-bold font-['Poppins']">({formatCurrency(option.price)})</span>
                  </div>
                )}
              />
            </div>

            {manualItems.length > 0 && (
              <div className="mt-5 space-y-3 rounded-2xl border border-zinc-150 bg-zinc-50/50 p-4">
                {manualItems.map((row) => {
                  const product = productOptions.find((p) => p.id === row.productId);
                  if (!product) return null;
                  return (
                    <div key={row.productId} className="grid grid-cols-1 md:grid-cols-5 gap-4 rounded-xl bg-white border border-zinc-150 shadow-sm p-4 items-center">
                      <div className="md:col-span-2 flex items-center gap-3">
                        <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-zinc-50 border border-zinc-150 flex-shrink-0">
                          <Image src={product.image} alt={product.name} fill className="object-cover" unoptimized />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-zinc-800 font-['Poppins']">{product.name}</div>
                          <div className="text-xs text-zinc-400 font-bold font-['Poppins'] mt-0.5">Price: {formatCurrency(product.price)}</div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider md:hidden">Qty</label>
                        <input type="number" min={1} className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-sm font-semibold text-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-['Poppins']" value={row.quantity} onChange={(e) => setManualItems((prev) => prev.map((it) => it.productId === row.productId ? { ...it, quantity: Math.max(1, Number(e.target.value || 1)) } : it))} placeholder="Qty" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider md:hidden">Color</label>
                        <input className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-sm font-semibold text-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-['Poppins']" value={row.color} onChange={(e) => setManualItems((prev) => prev.map((it) => it.productId === row.productId ? { ...it, color: e.target.value } : it))} placeholder="Color" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider md:hidden">Size</label>
                        <input className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-sm font-semibold text-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-['Poppins']" value={row.size} onChange={(e) => setManualItems((prev) => prev.map((it) => it.productId === row.productId ? { ...it, size: e.target.value } : it))} placeholder="Size" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-6 flex items-center justify-between border-t border-zinc-100 pt-5">
              <div className="text-base font-bold text-zinc-700 font-['Poppins']">
                Total: <span className="text-lg font-black text-purple-650">{formatCurrency(manualTotal)}</span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  disabled={creatingManualOrder}
                  className="px-5 py-2.5 bg-white border border-zinc-200 hover:bg-zinc-50 rounded-xl text-xs font-bold tracking-wider uppercase text-zinc-650 transition-all cursor-pointer font-['Poppins']"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateManualOrder}
                  disabled={creatingManualOrder}
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white text-xs font-bold tracking-wider uppercase rounded-xl shadow-md shadow-purple-200/50 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer font-['Poppins']"
                >
                  {creatingManualOrder ? 'Saving...' : 'Create Order'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
