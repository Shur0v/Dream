/**
 * Customer Order Data Types
 * 
 * @description Type definitions for customer order information in dashboard table
 */

export interface CustomerOrderItem {
  id: string;
  productName: string;
  productId: string;
  quantity: number;
  color: string;
  category: string;
  amount: number;
  currency?: string;
  status?: 'pending' | 'approved' | 'cancelled';
  createdAt?: string;
  // User details
  name?: string;
  phoneNumber?: string;
  email?: string;
  district?: string;
  upazila?: string;
  thana?: string;
  postOffice?: string;
}

export interface CustomerOrder {
  id: string;
  customerName?: string;
  customerId: string;
  items: CustomerOrderItem[];
  totalAmount: number;
  status: 'pending' | 'approved' | 'cancelled';
  orderDate: string;
}

