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
          <div className="flex items-center gap-2">
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-4 py-2 bg-fuchsia-500 text-white rounded-lg hover:bg-fuchsia-600 cursor-pointer transition-colors"
            >
              <span>Add Order</span>
            </button>
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
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">Add Manual Order</h3>
              <button
                onClick={() => !creatingManualOrder && setIsAddModalOpen(false)}
                className="rounded-md p-2 text-gray-500 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input className="rounded-lg border border-gray-300 p-3" placeholder="Customer name *" value={manualForm.name} onChange={(e) => setManualForm((prev) => ({ ...prev, name: e.target.value }))} />
              <input className="rounded-lg border border-gray-300 p-3" placeholder="Phone number *" value={manualForm.phoneNumber} onChange={(e) => setManualForm((prev) => ({ ...prev, phoneNumber: e.target.value }))} />
              <input className="rounded-lg border border-gray-300 p-3" placeholder="Email (optional)" value={manualForm.email} onChange={(e) => setManualForm((prev) => ({ ...prev, email: e.target.value }))} />
              <select className="rounded-lg border border-gray-300 p-3" value={manualForm.status} onChange={(e) => setManualForm((prev) => ({ ...prev, status: e.target.value }))}>
                <option value="approved">Accepted</option>
                <option value="pending">Pending</option>
              </select>
              <input className="rounded-lg border border-gray-300 p-3" placeholder="District *" value={manualForm.district} onChange={(e) => setManualForm((prev) => ({ ...prev, district: e.target.value }))} />
              <input className="rounded-lg border border-gray-300 p-3" placeholder="Upazila *" value={manualForm.upazila} onChange={(e) => setManualForm((prev) => ({ ...prev, upazila: e.target.value }))} />
              <input className="rounded-lg border border-gray-300 p-3" placeholder="Thana *" value={manualForm.thana} onChange={(e) => setManualForm((prev) => ({ ...prev, thana: e.target.value }))} />
              <input className="rounded-lg border border-gray-300 p-3" placeholder="Post office *" value={manualForm.postOffice} onChange={(e) => setManualForm((prev) => ({ ...prev, postOffice: e.target.value }))} />
              <input className="rounded-lg border border-gray-300 p-3 md:col-span-2" placeholder="Payment method" value={manualForm.paymentMethod} onChange={(e) => setManualForm((prev) => ({ ...prev, paymentMethod: e.target.value }))} />
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-gray-700">Select Products (one or multiple)</label>
              <SearchableMultiSelect
                options={productOptions}
                selectedIds={selectedProductIds}
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
                    <div className="relative h-8 w-8 overflow-hidden rounded-md bg-gray-100">
                      <Image src={option.image} alt={option.name} fill className="object-cover" unoptimized />
                    </div>
                    <span>{option.name}</span>
                    <span className="text-xs text-gray-500">({option.price})</span>
                  </div>
                )}
              />
            </div>

            {manualItems.length > 0 && (
              <div className="mt-4 space-y-3 rounded-lg border border-gray-200 p-4">
                {manualItems.map((row) => {
                  const product = productOptions.find((p) => p.id === row.productId);
                  if (!product) return null;
                  return (
                    <div key={row.productId} className="grid grid-cols-1 gap-2 rounded-md bg-gray-50 p-3 md:grid-cols-5">
                      <div className="md:col-span-2 flex items-center gap-2">
                        <div className="relative h-10 w-10 overflow-hidden rounded bg-white">
                          <Image src={product.image} alt={product.name} fill className="object-cover" unoptimized />
                        </div>
                        <div>
                          <div className="text-sm font-semibold">{product.name}</div>
                          <div className="text-xs text-gray-500">Price: à§³{product.price}</div>
                        </div>
                      </div>
                      <input type="number" min={1} className="rounded border border-gray-300 px-2 py-1" value={row.quantity} onChange={(e) => setManualItems((prev) => prev.map((it) => it.productId === row.productId ? { ...it, quantity: Math.max(1, Number(e.target.value || 1)) } : it))} placeholder="Qty" />
                      <input className="rounded border border-gray-300 px-2 py-1" value={row.color} onChange={(e) => setManualItems((prev) => prev.map((it) => it.productId === row.productId ? { ...it, color: e.target.value } : it))} placeholder="Color (optional)" />
                      <input className="rounded border border-gray-300 px-2 py-1" value={row.size} onChange={(e) => setManualItems((prev) => prev.map((it) => it.productId === row.productId ? { ...it, size: e.target.value } : it))} placeholder="Size (optional)" />
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-5 flex items-center justify-between border-t border-gray-200 pt-4">
              <div className="text-lg font-semibold text-gray-800">Total: à§³{manualTotal.toFixed(2)}</div>
              <div className="flex gap-2">
                <button onClick={() => setIsAddModalOpen(false)} disabled={creatingManualOrder} className="rounded-lg border border-gray-300 px-4 py-2">
                  Cancel
                </button>
                <button onClick={handleCreateManualOrder} disabled={creatingManualOrder} className="rounded-lg bg-fuchsia-500 px-4 py-2 font-semibold text-white disabled:opacity-70">
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

