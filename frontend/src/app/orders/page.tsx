'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Order } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  Package,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Loader2,
} from 'lucide-react';

export default function OrdersHistoryPage() {
  const { user, isBuyer, demoLogin } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      setIsLoading(true);
      try {
        const res = await api.getMyOrders();
        setOrders(res.orders);
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadOrders();
  }, [user]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-[#E8E2D6] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#253451]">
            My Orders & Custom Commissions
          </h1>
          <p className="text-xs text-[#5C5853] mt-1">
            Track fulfillment, craft progress, and view verified Digital Craft Passports.
          </p>
        </div>

        <Link
          href="/explore"
          className="text-xs font-semibold text-[#B65F43] hover:underline flex items-center gap-1 self-start sm:self-auto"
        >
          <span>Explore More Crafts</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#B65F43] mx-auto" />
          <p className="text-xs text-gray-500 mt-2">Loading your orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-[#E8E2D6] p-8 space-y-4">
          <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="font-serif text-xl font-bold text-[#253451]">No Orders Placed Yet</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            You haven&apos;t placed any orders yet. Start exploring authentic Indian crafts directly from master makers.
          </p>
          <Link
            href="/explore"
            className="inline-block bg-[#253451] text-white px-6 py-2.5 rounded-xl text-xs font-semibold"
          >
            Explore Catalogue
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((o) => (
            <div
              key={o.id}
              className="bg-white rounded-3xl border border-[#E8E2D6] p-6 shadow-sm space-y-4 hover:border-[#C5A56A] transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#B65F43] flex items-center justify-center font-bold">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-mono text-xs font-bold text-[#253451]">{o.orderNumber}</span>
                    <div className="text-[11px] text-gray-400">
                      Placed on {new Date(o.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-[11px] font-bold px-3 py-1 rounded-full capitalize ${
                      o.status === 'paid'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : o.status === 'shipped' || o.status === 'delivered'
                        ? 'bg-blue-50 text-blue-800 border border-blue-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {o.status.replace('_', ' ')}
                  </span>

                  <span className="font-serif text-lg font-bold text-[#253451]">
                    ₹{o.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Items in this order */}
              <div className="space-y-2">
                {o.items?.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs py-1">
                    <div className="flex items-center gap-3">
                      {item.productImage && (
                        <img src={item.productImage} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      )}
                      <div>
                        <div className="font-semibold text-gray-800">{item.productTitle || 'Handcrafted Craft Piece'}</div>
                        <div className="text-[10px] text-gray-400">Qty: {item.quantity}</div>
                      </div>
                    </div>

                    <span className="font-medium text-gray-700">
                      ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-gray-500">
                  Delivering to: {o.shippingAddress?.city}, {o.shippingAddress?.state}
                </span>

                <Link
                  href={`/orders/${o.id}`}
                  className="text-[#B65F43] hover:underline font-semibold flex items-center gap-1"
                >
                  <span>Track Order & View Passport</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
