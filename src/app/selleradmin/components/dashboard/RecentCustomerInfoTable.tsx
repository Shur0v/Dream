'use client';

import React, { useState, useEffect } from 'react';
import { MoreVertical, DollarSign, CheckCircle2, XCircle, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CustomerOrderItem } from '../../types/customer';
import { Modal } from '../ui/Modal';
import Pagination from '../ui/Pagination';
import { Order as ApiOrder } from '@/types';
import { getApiUrl } from '@/lib/apiConfig';

interface RecentCustomerInfoTableProps {
  className?: string;
  data?: CustomerOrderItem[];
}

/**
 * Recent Customer Info Table Component (Layer 3)
 * 
 * @description Professional and functional table for displaying customer order information
 * with proper alignment, spacing, and interactive elements
 */
/**
 * Transform API Order to CustomerOrderItem format (order-level, same as OrdersTable)
 */
function transformApiOrderToCustomerOrderItem(apiOrder: ApiOrder): CustomerOrderItem {
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

  // Map API status to table status
  const statusMap: Record<string, 'pending' | 'approved' | 'cancelled'> = {
    pending: 'pending',
    confirmed: 'approved',
    approved: 'approved',
    rejected: 'cancelled',
    shipped: 'approved',
    delivered: 'approved',
    cancelled: 'cancelled',
    refunded: 'cancelled',
  };

  const orderStatus = statusMap[apiOrder.status] || 'pending';

  // Get first item for display (same as OrdersTable shows first product)
  const firstItem = apiOrder.items[0];
  const totalQuantity = apiOrder.items.reduce((sum, item) => sum + (item.quantity || 1), 0);

  // Transform order to CustomerOrderItem (order-level, not item-level)
  return {
    id: apiOrder.id,
    productName: firstItem?.product?.name || 'Multiple Products',
    productId: `ORD-${apiOrder.id.slice(-8).padStart(8, '0')}`,
    quantity: totalQuantity,
    color: firstItem?.color || 'N/A',
    category: firstItem?.product?.category || 'Multiple',
    amount: apiOrder.totalAmount || 0,
    currency: 'BDT',
    status: orderStatus,
    createdAt: apiOrder.createdAt,
    name: customerInfo.name,
    phoneNumber: customerInfo.phoneNumber,
    email: customerInfo.email,
    district: customerInfo.district,
    upazila: customerInfo.upazila,
    thana: customerInfo.thana,
    postOffice: customerInfo.postOffice,
  };
}

export const RecentCustomerInfoTable: React.FC<RecentCustomerInfoTableProps> = ({
  className,
  data: propData,
}) => {
  const [orders, setOrders] = useState<CustomerOrderItem[]>(propData || []);
  const [isLoading, setIsLoading] = useState(!propData);
  const [error, setError] = useState<string | null>(null);
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const [approvedOrders, setApprovedOrders] = useState<Set<string>>(
    new Set(orders.filter(item => item.status === 'approved').map(item => item.id))
  );
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrderItem | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;

  // Fetch orders from API
  useEffect(() => {
    if (propData) {
      // If data is provided as prop, use it
      setOrders(propData);
      return;
    }

    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Use admin cache for instant loading
        const { getRecentOrders } = await import('@/lib/indexeddb/adminCache');
        const result = await getRecentOrders({
          page: currentPage,
          limit: itemsPerPage,
        });
        
        if (result.success && result.data) {
          // Transform API orders to CustomerOrderItem format (order-level, same as OrdersTable)
          const transformedOrders = result.data.map((apiOrder: ApiOrder) =>
            transformApiOrderToCustomerOrderItem(apiOrder)
          );
          
          // Update pagination info from API response
          if (result.pagination) {
            setTotalItems(result.pagination.total);
            setTotalPages(result.pagination.totalPages);
          } else {
            // Fallback if pagination not in response
            setTotalItems(transformedOrders.length);
            setTotalPages(Math.ceil(transformedOrders.length / itemsPerPage));
          }
          
          setOrders(transformedOrders);
          setApprovedOrders(
            new Set(transformedOrders.filter((item: CustomerOrderItem) => item.status === 'approved').map((item: CustomerOrderItem) => item.id))
          );
        } else {
          // Silent error - don't show error message
          setOrders([]);
          setTotalItems(0);
          setTotalPages(0);
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

    // Only fetch on page load or when dependencies change
    fetchOrders();
  }, [propData, currentPage, itemsPerPage]);

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const menuElements = document.querySelectorAll('[data-menu-container]');
      let clickedInsideMenu = false;

      menuElements.forEach((element) => {
        if (element.contains(target)) {
          clickedInsideMenu = true;
        }
      });

      if (!clickedInsideMenu && openMenuIndex !== null) {
        setOpenMenuIndex(null);
      }
    };

    if (openMenuIndex !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuIndex]);

  const handleMenuToggle = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  const handleApprove = async (index: number) => {
    const order = orders[index];
    try {
      // Extract order ID from the item ID (format: orderId-itemId)
      const orderId = order.id.split('-')[0];
      
      // Approve order via API
      const response = await fetch(`/api/admin/orders/${orderId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setApprovedOrders(prev => new Set([...prev, order.id]));
        setOrders(prev => prev.map((item, idx) => 
          idx === index ? { ...item, status: 'approved' as const } : item
        ));
      } else {
        const result = await response.json();
        throw new Error(result.error || 'Failed to approve order');
      }
    } catch (err: any) {
      console.error('Error approving order:', err);
      alert(err.message || 'Failed to approve order. Please try again.');
    }
    setOpenMenuIndex(null);
  };

  const handleDetail = (index: number) => {
    const order = orders[index];
    setSelectedOrder(order);
    setDetailModalOpen(true);
    setOpenMenuIndex(null);
  };

  const handleCancel = async (index: number) => {
    const order = orders[index];
    try {
      // Extract order ID from the item ID (format: orderId-itemId)
      const orderId = order.id.split('-')[0];
      
      // Cancel order via API
      const response = await fetch(`/api/admin/orders/${orderId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reason: 'Cancelled from dashboard',
        }),
      });

      if (response.ok) {
        setOrders(prev => prev.map((item, idx) => 
          idx === index ? { ...item, status: 'cancelled' as const } : item
        ));
        
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
      } else {
        const result = await response.json();
        throw new Error(result.error || 'Failed to cancel order');
      }
    } catch (err: any) {
      console.error('Error cancelling order:', err);
      alert(err.message || 'Failed to cancel order. Please try again.');
    }
    setOpenMenuIndex(null);
  };

  const formatAmount = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-100">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Approved
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-[11px] font-bold border border-rose-100">
            <XCircle className="w-3.5 h-3.5" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-[11px] font-bold border border-amber-100">
            Pending
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className={cn('self-stretch bg-white rounded-2xl border border-zinc-150/70 shadow-sm overflow-hidden', className)}>
        <div className="px-6 py-5 border-b border-zinc-100 bg-white">
          <h3 className="text-zinc-800 text-lg font-bold font-['Poppins']">
            Recent Customer Info
          </h3>
        </div>
        <div className="px-6 py-16 text-center bg-white">
          <div className="text-zinc-400 text-sm font-semibold font-['Poppins'] animate-pulse">
            Loading orders...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn('self-stretch bg-white rounded-2xl border border-zinc-150/70 shadow-sm overflow-hidden', className)}>
        <div className="px-6 py-5 border-b border-zinc-100 bg-white">
          <h3 className="text-zinc-800 text-lg font-bold font-['Poppins']">
            Recent Customer Info
          </h3>
        </div>
        <div className="px-6 py-16 text-center bg-white">
          <div className="text-rose-500 text-sm font-semibold font-['Poppins']">
            Error: {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('self-stretch bg-white rounded-2xl border border-zinc-150/70 shadow-sm overflow-hidden', className)}>
      {/* Table Header */}
      <div className="px-6 py-5 border-b border-zinc-100 bg-white">
        <h3 className="text-zinc-800 text-lg font-bold font-['Poppins']">
          Recent Customer Info
        </h3>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto bg-white">
        <table className="w-full border-collapse">
          {/* Table Head */}
          <thead>
            <tr className="bg-zinc-50/50 border-b border-zinc-100/80">
              <th className="px-6 py-4 text-left">
                <div className="text-zinc-400 text-[10px] font-extrabold font-['Poppins'] uppercase tracking-wider">
                  Product Name
                </div>
              </th>
              <th className="px-6 py-4 text-left">
                <div className="text-zinc-400 text-[10px] font-extrabold font-['Poppins'] uppercase tracking-wider">
                  Product ID
                </div>
              </th>
              <th className="px-6 py-4 text-center">
                <div className="text-zinc-400 text-[10px] font-extrabold font-['Poppins'] uppercase tracking-wider">
                  Quantity
                </div>
              </th>
              <th className="px-6 py-4 text-center">
                <div className="text-zinc-400 text-[10px] font-extrabold font-['Poppins'] uppercase tracking-wider">
                  Color
                </div>
              </th>
              <th className="px-6 py-4 text-center">
                <div className="text-zinc-400 text-[10px] font-extrabold font-['Poppins'] uppercase tracking-wider">
                  Category
                </div>
              </th>
              <th className="px-6 py-4 text-right">
                <div className="text-zinc-400 text-[10px] font-extrabold font-['Poppins'] uppercase tracking-wider">
                  Amount
                </div>
              </th>
              <th className="px-6 py-4 text-center">
                <div className="text-zinc-400 text-[10px] font-extrabold font-['Poppins'] uppercase tracking-wider">
                  Status
                </div>
              </th>
              <th className="px-6 py-4 text-center w-20">
                <div className="text-zinc-400 text-[10px] font-extrabold font-['Poppins'] uppercase tracking-wider">
                  Actions
                </div>
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-zinc-100/80">
            {orders.map((row, index) => (
              <tr
                key={row.id || index}
                className="hover:bg-zinc-50/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="text-zinc-800 text-sm font-bold font-['Poppins']">
                    {row.productName}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-purple-600 font-mono text-xs font-bold bg-purple-50/60 px-2 py-0.5 rounded-md border border-purple-100/50 inline-block">
                    <code>{row.productId}</code>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="text-zinc-700 text-sm font-semibold font-['Poppins']">
                    {row.quantity.toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="text-zinc-700 text-sm font-semibold font-['Poppins']">
                    {row.color}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="text-zinc-550 text-sm font-bold font-['Poppins']">
                    {row.category}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="inline-flex items-center gap-1 text-zinc-900 text-sm font-black font-['Poppins']">
                    <span className="text-[10px] text-zinc-400 font-bold">BDT</span>
                    <span>{row.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  {getStatusBadge(row.status)}
                </td>
                <td className="px-6 py-4 text-center">
                  <div data-menu-container className="relative inline-block">
                    <button
                      onClick={(e) => handleMenuToggle(index, e)}
                      className="p-1.5 rounded-xl hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 border border-transparent hover:border-zinc-200/50 transition-all inline-flex items-center justify-center cursor-pointer"
                      aria-label="Actions"
                    >
                      <MoreVertical className="w-4.5 h-4.5" />
                    </button>

                    {/* Action Menu */}
                    {openMenuIndex === index && (
                      <div className="absolute right-0 top-full mt-2 p-1.5 bg-white rounded-xl shadow-xl border border-zinc-200/60 flex flex-col gap-1 z-50 min-w-[130px]">
                        {/* Detail button - always visible */}
                        <button
                          onClick={() => handleDetail(index)}
                          className="px-3.5 py-2 text-xs font-bold text-purple-600 hover:bg-purple-50 rounded-lg transition-colors text-left flex items-center gap-2 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Detail
                        </button>
                        
                        {/* Approve button - only for pending orders */}
                        {row.status !== 'approved' && !approvedOrders.has(row.id) && (
                          <button
                            onClick={() => handleApprove(index)}
                            className="px-3.5 py-2 text-xs font-bold text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors text-left flex items-center gap-2 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Approve
                          </button>
                        )}
                        
                        {/* Cancel button - always visible */}
                        <button
                          onClick={() => handleCancel(index)}
                          className="px-3.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-left flex items-center gap-2 cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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

      {/* Table Footer */}
      {orders.length === 0 && !isLoading && (
        <div className="px-6 py-16 text-center bg-white">
          <div className="text-zinc-400 text-sm font-semibold font-['Poppins']">
            No customer orders found
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <Modal
        isOpen={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedOrder(null);
        }}
        className="max-w-[720px] rounded-2xl"
      >
        <div className="w-full px-6 py-8 flex flex-col gap-6">
          <div className="flex flex-col gap-1 border-b border-zinc-100 pb-4">
            <h3 className="text-lg font-bold text-zinc-900 font-['Poppins']">Customer Order Details</h3>
            <p className="text-xs text-zinc-450 font-semibold font-['Poppins']">Detailed shipment and customer profile</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Name Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-zinc-450 font-['Poppins'] uppercase tracking-wider">Name</label>
              <div className="w-full bg-zinc-50 border border-zinc-200/80 rounded-xl px-4 py-3 text-sm font-semibold text-zinc-700 shadow-sm font-['Poppins']">
                {selectedOrder?.name || 'N/A'}
              </div>
            </div>

            {/* Phone Number Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-zinc-450 font-['Poppins'] uppercase tracking-wider">Phone Number</label>
              <div className="w-full bg-zinc-50 border border-zinc-200/80 rounded-xl px-4 py-3 text-sm font-semibold text-zinc-700 shadow-sm font-['Poppins']">
                {selectedOrder?.phoneNumber || 'N/A'}
              </div>
            </div>

            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-zinc-450 font-['Poppins'] uppercase tracking-wider">Email</label>
              <div className="w-full bg-zinc-50 border border-zinc-200/80 rounded-xl px-4 py-3 text-sm font-semibold text-zinc-700 shadow-sm font-['Poppins'] break-all">
                {selectedOrder?.email || 'N/A'}
              </div>
            </div>

            {/* District Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-zinc-450 font-['Poppins'] uppercase tracking-wider">District</label>
              <div className="w-full bg-zinc-50 border border-zinc-200/80 rounded-xl px-4 py-3 text-sm font-semibold text-zinc-700 shadow-sm font-['Poppins']">
                {selectedOrder?.district || 'N/A'}
              </div>
            </div>

            {/* Upazila Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-zinc-450 font-['Poppins'] uppercase tracking-wider">Upazila</label>
              <div className="w-full bg-zinc-50 border border-zinc-200/80 rounded-xl px-4 py-3 text-sm font-semibold text-zinc-700 shadow-sm font-['Poppins']">
                {selectedOrder?.upazila || 'N/A'}
              </div>
            </div>

            {/* Thana Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-zinc-450 font-['Poppins'] uppercase tracking-wider">Thana</label>
              <div className="w-full bg-zinc-50 border border-zinc-200/80 rounded-xl px-4 py-3 text-sm font-semibold text-zinc-700 shadow-sm font-['Poppins']">
                {selectedOrder?.thana || 'N/A'}
              </div>
            </div>

            {/* Post office Field */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-xs font-bold text-zinc-450 font-['Poppins'] uppercase tracking-wider">Post Office / ZIP</label>
              <div className="w-full bg-zinc-50 border border-zinc-200/80 rounded-xl px-4 py-3 text-sm font-semibold text-zinc-700 shadow-sm font-['Poppins']">
                {selectedOrder?.postOffice || 'N/A'}
              </div>
            </div>
          </div>

          {/* Confirm Close Button */}
          <button
            onClick={() => {
              setDetailModalOpen(false);
              setSelectedOrder(null);
            }}
            className="w-full h-11 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-xl text-white text-xs font-bold tracking-wider uppercase shadow-md shadow-purple-200/50 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex justify-center items-center"
          >
            Confirm Details
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default RecentCustomerInfoTable;
