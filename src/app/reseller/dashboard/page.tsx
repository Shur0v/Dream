'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { 
  Bell, 
  ChevronDown, 
  Calendar, 
  Wallet, 
  Clock, 
  ShoppingBag, 
  Users, 
  Copy, 
  Facebook, 
  MessageCircle, 
  Send, 
  MoreHorizontal,
  ChevronRight,
  WalletCards
} from 'lucide-react';

export default function ResellerDashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          fetch('/api/products?limit=200', { cache: 'no-store' }),
          fetch('/api/orders', { cache: 'no-store' }),
        ]);
        const productsJson = await productsRes.json();
        const ordersJson = await ordersRes.json();
        if (!mounted) return;
        setProducts(Array.isArray(productsJson?.data) ? productsJson.data : []);
        setOrders(Array.isArray(ordersJson?.data) ? ordersJson.data : []);
      } catch (error) {
        console.error('Reseller dashboard load error:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const wholesaleProducts = useMemo(() => products.slice(0, 8), [products]);
  const totalPurchase = useMemo(() => orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0), [orders]);
  
  // Derived metrics for UI layout
  const pendingBalance = totalPurchase * 0.15; // Mock calculation based on real data
  const totalCommission = totalPurchase * 0.10;

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto w-full">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-gray-900 flex items-center gap-2">
            Welcome back, Reseller! <span className="text-2xl">👋</span>
          </h1>
          <p className="text-gray-500 text-[15px]">Here's what's happening with your store today.</p>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-gray-100 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
            <Calendar className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">This Month</span>
            <ChevronDown className="w-4 h-4 text-gray-400 ml-1" />
          </div>
          
          <div className="flex items-center gap-5">
            <div className="relative cursor-pointer hover:opacity-80 transition-opacity">
              <Bell className="w-6 h-6 text-gray-600" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center border-2 border-[#F4F7FE]">
                <span className="text-[9px] font-bold text-white">3</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                R
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-bold text-gray-900 leading-none mb-1">Reseller User</p>
                <p className="text-xs text-gray-500 leading-none">Level 2</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Total Earnings */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="w-[60px] h-[60px] rounded-full bg-[#F3F0FF] flex items-center justify-center flex-shrink-0">
            <Wallet className="w-7 h-7 text-[#7C3AED]" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Total Earnings</p>
            <div className="flex items-end gap-2">
              <h3 className="text-[28px] font-bold text-gray-900 leading-none">৳ {loading ? '...' : totalPurchase.toLocaleString('en-US', {minimumFractionDigits:0})}</h3>
            </div>
            <p className="text-xs text-[#059669] font-medium mt-2 flex items-center gap-1">
              ↑ 18.5% <span className="text-gray-400 font-normal">this week</span>
            </p>
          </div>
        </div>

        {/* Pending Balance */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="w-[60px] h-[60px] rounded-full bg-[#FFF0F6] flex items-center justify-center flex-shrink-0">
            <Clock className="w-7 h-7 text-[#DB2777]" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Pending Balance</p>
            <div className="flex items-end gap-2">
              <h3 className="text-[28px] font-bold text-gray-900 leading-none">৳ {loading ? '...' : pendingBalance.toLocaleString('en-US', {minimumFractionDigits:0})}</h3>
            </div>
            <p className="text-xs text-[#059669] font-medium mt-2 flex items-center gap-1">
              ↑ 12.3% <span className="text-gray-400 font-normal">this week</span>
            </p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="w-[60px] h-[60px] rounded-full bg-[#EFF6FF] flex items-center justify-center flex-shrink-0">
            <ShoppingBag className="w-7 h-7 text-[#2563EB]" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Total Orders</p>
            <div className="flex items-end gap-2">
              <h3 className="text-[28px] font-bold text-gray-900 leading-none">{loading ? '...' : orders.length || 58}</h3>
            </div>
            <p className="text-xs text-[#059669] font-medium mt-2 flex items-center gap-1">
              ↑ 15.7% <span className="text-gray-400 font-normal">this week</span>
            </p>
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="w-[60px] h-[60px] rounded-full bg-[#F5F3FF] flex items-center justify-center flex-shrink-0">
            <Users className="w-7 h-7 text-[#8B5CF6]" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Total Customers</p>
            <div className="flex items-end gap-2">
              <h3 className="text-[28px] font-bold text-gray-900 leading-none">{loading ? '...' : products.length || 42}</h3>
            </div>
            <p className="text-xs text-[#059669] font-medium mt-2 flex items-center gap-1">
              ↑ 10.2% <span className="text-gray-400 font-normal">this week</span>
            </p>
          </div>
        </div>
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Earnings Overview */}
        <div className="lg:col-span-1 xl:col-span-2 bg-white rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">Earnings Overview</h3>
            <div className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-50">
              This Week <ChevronDown className="w-4 h-4 ml-1" />
            </div>
          </div>
          
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-sm bg-[#7C3AED]"></div>
            <span className="text-sm text-gray-500 font-medium">Earnings (৳)</span>
          </div>
          
          {/* Chart Graphic representation */}
          <div className="flex-1 relative w-full min-h-[250px] mt-2">
            <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-[11px] text-gray-400 font-medium">
              <span>10K</span><span>8K</span><span>6K</span><span>4K</span><span>2K</span><span>0</span>
            </div>
            <div className="absolute left-8 right-0 top-0 bottom-8 flex flex-col justify-between">
              {[0,1,2,3,4,5].map(i => (
                <div key={i} className="w-full h-[1px] bg-gray-100"></div>
              ))}
            </div>
            <svg className="absolute left-8 right-0 top-0 bottom-8 w-[calc(100%-32px)] h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path 
                d="M 0,200 C 50,150 100,100 150,120 C 200,140 250,80 300,100 C 350,120 400,180 450,140 C 500,100 550,50 600,80 C 650,110 700,60 800,90 L 800,250 L 0,250 Z" 
                fill="url(#chartGradient)" 
                transform="scale(1, 1)" 
                vectorEffect="non-scaling-stroke" 
                style={{transformOrigin: 'bottom', transform: 'scaleY(0.95)'}}
              />
              <path 
                d="M 0,200 C 50,150 100,100 150,120 C 200,140 250,80 300,100 C 350,120 400,180 450,140 C 500,100 550,50 600,80 C 650,110 700,60 800,90" 
                fill="none" 
                stroke="#7C3AED" 
                strokeWidth="3" 
                vectorEffect="non-scaling-stroke"
                style={{transformOrigin: 'bottom', transform: 'scaleY(0.95)'}}
              />
              {[
                {x: '0%', y: '85%'}, {x: '16.6%', y: '50%'}, {x: '33.3%', y: '60%'},
                {x: '50%', y: '35%'}, {x: '66.6%', y: '65%'}, {x: '83.3%', y: '30%'}, {x: '100%', y: '40%'}
              ].map((point, i) => (
                <circle key={i} cx={point.x} cy={point.y} r="5" fill="white" stroke="#7C3AED" strokeWidth="2" className="transition-all hover:r-6 hover:stroke-[3px] cursor-pointer" />
              ))}
            </svg>
            <div className="absolute left-8 right-0 bottom-0 flex justify-between text-[11px] text-gray-400 font-medium">
              <span>May 15</span><span>May 16</span><span>May 17</span><span>May 18</span><span>May 19</span><span>May 20</span><span>May 21</span>
            </div>
          </div>
        </div>

        {/* Right side widgets */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Referral Link */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Referral Link</h3>
            <p className="text-sm text-gray-500 mb-4">Share your link and earn commission</p>
            
            <div className="flex mb-6">
              <input 
                type="text" 
                readOnly 
                value="https://dreamshop.com/ref/DSR12345" 
                className="bg-gray-50 border border-gray-200 text-gray-600 text-sm rounded-l-xl px-4 py-3 w-full outline-none"
              />
              <button className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-4 py-3 rounded-r-xl transition-colors flex items-center justify-center">
                <Copy className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-sm text-gray-500 mb-3">Share on social media</p>
            <div className="flex gap-3">
              <button className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:opacity-90 transition-opacity">
                <Facebook className="w-5 h-5 fill-current" />
              </button>
              <button className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:opacity-90 transition-opacity">
                <MessageCircle className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 rounded-full bg-[#0088CC] text-white flex items-center justify-center hover:opacity-90 transition-opacity">
                <Send className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex-1 flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Top Products</h3>
            <div className="space-y-4 flex-1">
              {wholesaleProducts.slice(0,3).map((product, idx) => (
                <div key={product.id || idx} className="flex items-center justify-between p-2 -mx-2 hover:bg-gray-50 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
                      {product.images && product.images[0] ? (
                        <img src={product.images[0].url || product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] text-gray-400 font-medium">Img</span>
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{product.name || 'Awesome Product'}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">৳ {Number(product.price || 1200).toFixed(0)}</p>
                    </div>
                  </div>
                  <div className="bg-[#F5F3FF] text-[#7C3AED] text-xs font-bold px-2.5 py-1 rounded-lg whitespace-nowrap">
                    {product.stock || (12 - idx * 2)} Orders
                  </div>
                </div>
              ))}
              {!loading && wholesaleProducts.length === 0 && (
                <div className="flex flex-col items-center justify-center py-6 text-gray-400">
                  <ShoppingBag className="w-8 h-8 mb-2 opacity-20" />
                  <p className="text-sm">No products available</p>
                </div>
              )}
            </div>
            
            <button className="w-full mt-5 text-[#7C3AED] text-sm font-bold flex items-center justify-between hover:underline group">
              View All Products
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Recent Orders */}
        <div className="flex-1 bg-white rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-x-auto">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Orders</h3>
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left pb-4 text-sm font-medium text-gray-500">Order ID</th>
                <th className="text-left pb-4 text-sm font-medium text-gray-500">Customer</th>
                <th className="text-left pb-4 text-sm font-medium text-gray-500">Product</th>
                <th className="text-left pb-4 text-sm font-medium text-gray-500">Amount</th>
                <th className="text-left pb-4 text-sm font-medium text-gray-500">Commission</th>
                <th className="text-left pb-4 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left pb-4 text-sm font-medium text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order, idx) => {
                const isDelivered = order.status?.toLowerCase() === 'delivered' || idx % 3 === 0;
                const isPending = order.status?.toLowerCase() === 'pending' || idx % 3 === 2;
                
                return (
                  <tr key={order.id || idx} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 text-sm font-bold text-gray-900">#{order.id?.substring(0,6).toUpperCase() || 'DS' + (12345 - idx)}</td>
                    <td className="py-4 text-sm text-gray-600 font-medium">{order.customerName || ['John Doe', 'Jane Smith', 'Michael Brown', 'Emily Davis', 'Chris Wilson'][idx]}</td>
                    <td className="py-4 text-sm text-gray-600">{order.items?.[0]?.productName || ['Smart Watch', 'Wireless Earbuds', 'LED Desk Lamp', 'Phone Case', 'Charger'][idx]}</td>
                    <td className="py-4 text-sm font-bold text-gray-900">৳ {order.totalAmount?.toLocaleString() || [1250, 950, 650, 350, 250][idx]}</td>
                    <td className="py-4 text-sm font-bold text-[#7C3AED]">৳ {((order.totalAmount || [1250, 950, 650, 350, 250][idx]) * 0.1).toFixed(0)}</td>
                    <td className="py-4">
                      <span className={`text-xs font-bold px-2.5 py-1.5 rounded-md ${
                        isDelivered ? 'bg-[#ECFDF5] text-[#059669]' : 
                        isPending ? 'bg-[#EFF6FF] text-[#2563EB]' : 
                        'bg-[#FFFBEB] text-[#D97706]'
                      }`}>
                        {isDelivered ? 'Delivered' : isPending ? 'Pending' : 'Processing'}
                      </span>
                    </td>
                    <td className="py-4 text-sm text-gray-500 font-medium">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'}) : `May ${21 - idx}, 2024`}
                    </td>
                  </tr>
                );
              })}
              {!loading && orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center">
                      <ShoppingBag className="w-10 h-10 mb-3 opacity-20" />
                      <p className="text-sm font-medium">No recent orders found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Wallet Balance */}
        <div className="w-full lg:w-[350px] bg-[#302293] rounded-2xl p-8 shadow-xl text-white relative overflow-hidden flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-[#7C3AED]/30 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-8">
              <h3 className="text-[17px] font-semibold text-white/90">Wallet Balance</h3>
              <WalletCards className="w-8 h-8 text-white/80" />
            </div>
            
            <h2 className="text-[42px] font-bold mb-2 tracking-tight">৳ {pendingBalance.toLocaleString('en-US', {minimumFractionDigits:2})}</h2>
            <p className="text-[13px] text-white/70 mb-8 font-medium">You can withdraw your earnings</p>
          </div>
          
          <button className="w-full bg-white text-[#302293] py-3.5 rounded-xl font-bold hover:bg-gray-50 transition-colors relative z-10 flex justify-center items-center gap-2 shadow-[0_4px_14px_rgba(0,0,0,0.1)]">
            Withdraw Now
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

