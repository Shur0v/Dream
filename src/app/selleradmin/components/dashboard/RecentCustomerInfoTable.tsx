'use client';

import React, { useState, useEffect } from 'react';
import { MoreVertical, DollarSign, CheckCircle2, XCircle, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CustomerOrderItem } from '../../types/customer';
import { Modal } from '../ui/Modal';

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
export const RecentCustomerInfoTable: React.FC<RecentCustomerInfoTableProps> = ({
  className,
  data = [
    {
      id: '1',
      productName: 'T-shirt',
      productId: '#12345678A',
      quantity: 5985,
      color: 'Red',
      category: 'T-shirt',
      amount: 809.99,
      currency: 'USD',
      status: 'pending',
    },
    {
      id: '2',
      productName: 'Casual Shirt',
      productId: '#87654321B',
      quantity: 2450,
      color: 'Blue',
      category: 'Shirt',
      amount: 599.50,
      currency: 'USD',
      status: 'pending',
    },
    {
      id: '3',
      productName: 'Jeans',
      productId: '#11223344C',
      quantity: 3200,
      color: 'Black',
      category: 'Pants',
      amount: 1299.00,
      currency: 'USD',
      status: 'approved',
      name: 'John Doe',
      phoneNumber: '+1 234 567 8900',
      email: 'john.doe@example.com',
      district: 'Dhaka',
      upazila: 'Dhanmondi',
      thana: 'Dhanmondi',
      postOffice: 'Dhanmondi',
    },
    {
      id: '4',
      productName: 'Sneakers',
      productId: '#55667788D',
      quantity: 1500,
      color: 'White',
      category: 'Footwear',
      amount: 2499.75,
      currency: 'USD',
      status: 'pending',
    },
    {
      id: '5',
      productName: 'Jacket',
      productId: '#99887766E',
      quantity: 800,
      color: 'Brown',
      category: 'Outerwear',
      amount: 1899.25,
      currency: 'USD',
      status: 'pending',
    },
    {
      id: '6',
      productName: 'Watch',
      productId: '#44332211F',
      quantity: 250,
      color: 'Silver',
      category: 'Accessories',
      amount: 1599.00,
      currency: 'USD',
      status: 'cancelled',
    },
  ],
}) => {
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const [approvedOrders, setApprovedOrders] = useState<Set<string>>(
    new Set(data.filter(item => item.status === 'approved').map(item => item.id))
  );
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrderItem | null>(null);

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

  const handleApprove = (index: number) => {
    const order = data[index];
    setApprovedOrders(prev => new Set([...prev, order.id]));
    // Update status to approved
    if (order.status !== 'approved') {
      order.status = 'approved';
    }
    console.log('Approve', order);
    setOpenMenuIndex(null);
  };

  const handleDetail = (index: number) => {
    const order = data[index];
    setSelectedOrder(order);
    setDetailModalOpen(true);
    setOpenMenuIndex(null);
  };

  const handleCancel = (index: number) => {
    console.log('Cancel', data[index]);
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
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-green-50 text-green-700 text-xs font-medium">
            <CheckCircle2 className="w-3 h-3" />
            Approved
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-red-50 text-red-700 text-xs font-medium">
            <XCircle className="w-3 h-3" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-yellow-50 text-yellow-700 text-xs font-medium">
            Pending
          </span>
        );
    }
  };

  return (
    <div className={cn('self-stretch bg-white rounded-xl border border-neutral-200 shadow-sm', className)}>
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-neutral-200">
        <h3 className="text-neutral-950 text-2xl font-semibold font-['Poppins'] leading-8">
          Recent Customer Info
        </h3>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Table Head */}
          <thead>
            <tr className="bg-neutral-50 border-b border-neutral-200">
              <th className="px-6 py-4 text-left">
                <div className="text-neutral-950 text-sm font-semibold font-['Poppins'] uppercase tracking-wider">
                  Product Name
                </div>
              </th>
              <th className="px-6 py-4 text-left">
                <div className="text-neutral-950 text-sm font-semibold font-['Poppins'] uppercase tracking-wider">
                  Product ID
                </div>
              </th>
              <th className="px-6 py-4 text-center">
                <div className="text-neutral-950 text-sm font-semibold font-['Poppins'] uppercase tracking-wider">
                  Quantity
                </div>
              </th>
              <th className="px-6 py-4 text-center">
                <div className="text-neutral-950 text-sm font-semibold font-['Poppins'] uppercase tracking-wider">
                  Color
                </div>
              </th>
              <th className="px-6 py-4 text-center">
                <div className="text-neutral-950 text-sm font-semibold font-['Poppins'] uppercase tracking-wider">
                  Category
                </div>
              </th>
              <th className="px-6 py-4 text-right">
                <div className="text-neutral-950 text-sm font-semibold font-['Poppins'] uppercase tracking-wider">
                  Amount
                </div>
              </th>
              <th className="px-6 py-4 text-center">
                <div className="text-neutral-950 text-sm font-semibold font-['Poppins'] uppercase tracking-wider">
                  Status
                </div>
              </th>
              <th className="px-6 py-4 text-center w-20">
                <div className="text-neutral-950 text-sm font-semibold font-['Poppins'] uppercase tracking-wider">
                  Actions
                </div>
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-neutral-200">
            {data.map((row, index) => (
              <tr
                key={row.id || index}
                className="hover:bg-neutral-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="text-neutral-900 text-sm font-normal font-['Poppins']">
                    {row.productName}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-neutral-700 text-sm font-normal font-['Poppins']">
                    <code className="text-xs">{row.productId}</code>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="text-neutral-900 text-sm font-normal font-['Poppins']">
                    {row.quantity.toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="text-neutral-900 text-sm font-normal font-['Poppins']">
                    {row.color}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="text-neutral-900 text-sm font-normal font-['Poppins']">
                    {row.category}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="inline-flex items-center gap-1.5 text-neutral-900 text-sm font-medium font-['Poppins']">
                    <DollarSign className="w-4 h-4 text-neutral-600" />
                    <span>{formatAmount(row.amount, row.currency)}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  {getStatusBadge(row.status)}
                </td>
                <td className="px-6 py-4 text-center">
                  <div data-menu-container className="relative inline-block">
                    <button
                      onClick={(e) => handleMenuToggle(index, e)}
                      className="p-2 rounded-lg hover:bg-neutral-100 transition-colors inline-flex items-center justify-center"
                      aria-label="Actions"
                    >
                      <MoreVertical className="w-5 h-5 text-neutral-600" />
                    </button>

                    {/* Action Menu */}
                    {openMenuIndex === index && (
                      <div className="absolute right-0 top-full mt-2 p-2 bg-white rounded-lg shadow-lg border border-neutral-200 flex flex-col gap-1.5 z-50 min-w-[140px]">
                        {/* Detail button - always visible */}
                        <button
                          onClick={() => handleDetail(index)}
                          className="px-5 py-2 text-sm text-blue-700 hover:bg-blue-50 rounded-md transition-colors text-left flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Detail
                        </button>
                        
                        {/* Approve button - only for pending orders */}
                        {row.status !== 'approved' && !approvedOrders.has(row.id) && (
                          <button
                            onClick={() => handleApprove(index)}
                            className="px-5 py-2 text-sm text-green-700 hover:bg-green-50 rounded-md transition-colors text-left flex items-center gap-2"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Approve
                          </button>
                        )}
                        
                        {/* Cancel button - always visible */}
                        <button
                          onClick={() => handleCancel(index)}
                          className="px-5 py-2 text-sm text-red-700 hover:bg-red-50 rounded-md transition-colors text-left flex items-center gap-2"
                        >
                          <XCircle className="w-4 h-4" />
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

      {/* Table Footer (Optional - for pagination or summary) */}
      {data.length === 0 && (
        <div className="px-6 py-12 text-center">
          <div className="text-neutral-500 text-sm font-normal font-['Poppins']">
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
        className="max-w-[960px] h-[872px]"
      >
        <div className="w-full h-full px-4 py-[73px] flex flex-col justify-start items-center gap-8">
          <div className="w-full max-w-[808px] flex flex-col justify-start items-start gap-5">
            {/* Name Field */}
            <div className="self-stretch flex flex-col justify-start items-start gap-2">
              <div className="self-stretch inline-flex justify-start items-start gap-2">
                <div className="flex-1 justify-start text-neutral-800 text-base font-medium font-['Poppins'] leading-5">Name</div>
              </div>
              <div className="self-stretch p-3 rounded-lg outline-1 outline-offset-[-1px] outline-zinc-400 inline-flex justify-start items-center gap-1 overflow-hidden">
                <div className="flex-1 h-6 flex justify-start items-center gap-2 overflow-hidden">
                  <div className="justify-start text-zinc-600 text-base font-normal font-['Poppins'] leading-5">
                    {selectedOrder?.name || 'Type category name here. . .'}
                  </div>
                </div>
              </div>
            </div>

            {/* Phone Number Field */}
            <div className="self-stretch flex flex-col justify-start items-start gap-2">
              <div className="self-stretch inline-flex justify-start items-start gap-2">
                <div className="flex-1 justify-start text-neutral-800 text-base font-medium font-['Poppins'] leading-5">Phone Number</div>
              </div>
              <div className="self-stretch h-12 p-3 rounded-lg outline-1 outline-offset-[-1px] outline-zinc-400 inline-flex justify-start items-start gap-1 overflow-hidden">
                <div className="flex-1 flex justify-start items-start gap-2 overflow-hidden">
                  <div className="flex-1 justify-start text-zinc-600 text-base font-normal font-['Poppins'] leading-5">
                    {selectedOrder?.phoneNumber || 'Type child category name here. . .'}
                  </div>
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div className="self-stretch flex flex-col justify-start items-start gap-2">
              <div className="self-stretch inline-flex justify-start items-start gap-2">
                <div className="flex-1 justify-start text-neutral-800 text-base font-medium font-['Poppins'] leading-5">Email</div>
              </div>
              <div className="self-stretch h-12 p-3 rounded-lg outline-1 outline-offset-[-1px] outline-zinc-400 inline-flex justify-start items-start gap-1 overflow-hidden">
                <div className="flex-1 flex justify-start items-start gap-2 overflow-hidden">
                  <div className="flex-1 justify-start text-zinc-600 text-base font-normal font-['Poppins'] leading-5">
                    {selectedOrder?.email || 'Type child category name here. . .'}
                  </div>
                </div>
              </div>
            </div>

            {/* District Field */}
            <div className="self-stretch flex flex-col justify-start items-start gap-2">
              <div className="self-stretch inline-flex justify-start items-start gap-2">
                <div className="flex-1 justify-start text-neutral-800 text-base font-medium font-['Poppins'] leading-5">District</div>
              </div>
              <div className="self-stretch h-12 p-3 rounded-lg outline-1 outline-offset-[-1px] outline-zinc-400 inline-flex justify-start items-start gap-1 overflow-hidden">
                <div className="flex-1 flex justify-start items-start gap-2 overflow-hidden">
                  <div className="flex-1 justify-start text-zinc-600 text-base font-normal font-['Poppins'] leading-5">
                    {selectedOrder?.district || 'Type child category name here. . .'}
                  </div>
                </div>
              </div>
            </div>

            {/* Upazila Field */}
            <div className="self-stretch flex flex-col justify-start items-start gap-2">
              <div className="self-stretch inline-flex justify-start items-start gap-2">
                <div className="flex-1 justify-start text-neutral-800 text-base font-medium font-['Poppins'] leading-5">Upazila</div>
              </div>
              <div className="self-stretch h-12 p-3 rounded-lg outline-1 outline-offset-[-1px] outline-zinc-400 inline-flex justify-start items-start gap-1 overflow-hidden">
                <div className="flex-1 flex justify-start items-start gap-2 overflow-hidden">
                  <div className="flex-1 justify-start text-zinc-600 text-base font-normal font-['Poppins'] leading-5">
                    {selectedOrder?.upazila || 'Type child category name here. . .'}
                  </div>
                </div>
              </div>
            </div>

            {/* Thana Field */}
            <div className="self-stretch flex flex-col justify-start items-start gap-2">
              <div className="self-stretch inline-flex justify-start items-start gap-2">
                <div className="flex-1 justify-start text-neutral-800 text-base font-medium font-['Poppins'] leading-5">Thana</div>
              </div>
              <div className="self-stretch h-12 p-3 rounded-lg outline-1 outline-offset-[-1px] outline-zinc-400 inline-flex justify-start items-start gap-1 overflow-hidden">
                <div className="flex-1 flex justify-start items-start gap-2 overflow-hidden">
                  <div className="flex-1 justify-start text-zinc-600 text-base font-normal font-['Poppins'] leading-5">
                    {selectedOrder?.thana || 'Type child category name here. . .'}
                  </div>
                </div>
              </div>
            </div>

            {/* Post office Field */}
            <div className="self-stretch flex flex-col justify-start items-start gap-2">
              <div className="self-stretch inline-flex justify-start items-start gap-2">
                <div className="flex-1 justify-start text-neutral-800 text-base font-medium font-['Poppins'] leading-5">Post office</div>
              </div>
              <div className="self-stretch h-12 p-3 rounded-lg outline-1 outline-offset-[-1px] outline-zinc-400 inline-flex justify-start items-start gap-1 overflow-hidden">
                <div className="flex-1 flex justify-start items-start gap-2 overflow-hidden">
                  <div className="flex-1 justify-start text-zinc-600 text-base font-normal font-['Poppins'] leading-5">
                    {selectedOrder?.postOffice || 'Type child category name here. . .'}
                  </div>
                </div>
              </div>
            </div>

            {/* Confirm Button */}
            <button
              onClick={() => {
                setDetailModalOpen(false);
                setSelectedOrder(null);
              }}
              className="self-stretch h-12 px-6 py-3 bg-fuchsia-500 rounded inline-flex justify-center items-center gap-2.5 cursor-pointer hover:bg-fuchsia-600 transition-colors"
            >
              <div className="justify-start text-white text-base font-medium font-['Inter'] leading-5">Confirm</div>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RecentCustomerInfoTable;
