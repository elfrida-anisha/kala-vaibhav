'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Order } from '@/lib/types';
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Award,
  ArrowRight,
  ShieldCheck,
  Calendar,
  AlertCircle,
  Loader2,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function OrderDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      if (!id) return;
      setIsLoading(true);
      try {
        const res = await api.getOrder(id);
        setOrder(res.order);
      } catch (err) {
        console.error('Failed to load order:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadOrder();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#B65F43]" />
        <p className="text-xs text-gray-500 font-medium">Loading order fulfillment details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-gray-300 mx-auto" />
        <h2 className="font-serif text-2xl font-bold text-[#253451]">Order Not Found</h2>
        <Link href="/orders" className="text-xs text-[#B65F43] font-semibold hover:underline">
          Return to My Orders
        </Link>
      </div>
    );
  }

  const steps = [
    { label: 'Order Confirmed', done: true },
    { label: 'Payment Verified', done: order.status !== 'pending' },
    { label: 'Artisan Workshop Crafting', done: order.status === 'in_production' || order.status === 'shipped' || order.status === 'delivered' },
    { label: 'Shipped with Insurance', done: order.status === 'shipped' || order.status === 'delivered' },
    { label: 'Delivered', done: order.status === 'delivered' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Success Confirmation Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#C5A56A] shadow-md space-y-4 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <div className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider">
                {order.isDemo ? 'Demo Order Confirmed (Test Mode)' : 'Order Successfully Confirmed'}
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#253451]">
                Thank you, {order.buyerName || 'Connoisseur'}!
              </h1>
              <div className="text-xs font-mono text-gray-500 mt-0.5">
                Order Tracking ID: <strong className="text-[#253451]">{order.orderNumber}</strong>
              </div>
            </div>
          </div>

          <div className="text-sm bg-[#FAF7F0] p-4 rounded-2xl border border-[#E8E2D6] sm:text-right">
            <span className="text-[10px] text-gray-400 uppercase font-semibold">Total Paid</span>
            <div className="font-serif text-2xl font-bold text-[#B65F43]">
              ₹{order.totalAmount.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Fulfillment Stepper */}
        <div className="pt-6 border-t border-gray-100 space-y-3">
          <div className="text-xs font-bold text-[#253451] uppercase tracking-wider">
            Fulfillment Journey:
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
            {steps.map((st, i) => (
              <div
                key={i}
                className={`p-2.5 rounded-xl border transition-all ${
                  st.done
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300 font-bold'
                    : 'bg-gray-50 text-gray-400 border-gray-200'
                }`}
              >
                <div className="text-[10px] uppercase opacity-70">Stage {i + 1}</div>
                <div className="truncate mt-0.5">{st.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Items & Digital Craft Passport Links */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E2D6] shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <h2 className="font-serif font-bold text-lg text-[#253451] flex items-center gap-2">
            <Package className="w-5 h-5 text-[#B65F43]" />
            <span>Ordered Artisan Items</span>
          </h2>
          <span className="text-xs text-gray-500">{order.items?.length || 0} item(s)</span>
        </div>

        <div className="divide-y divide-gray-100">
          {order.items?.map((item) => (
            <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {item.productImage && (
                  <img
                    src={item.productImage}
                    alt={item.productTitle}
                    className="w-16 h-16 rounded-xl object-cover border border-gray-100 shrink-0"
                  />
                )}
                <div>
                  <h3 className="font-serif font-bold text-sm text-[#253451]">
                    {item.productTitle || 'Handcrafted Heritage Item'}
                  </h3>
                  <div className="text-xs text-gray-500">
                    Quantity: {item.quantity} • Unit: ₹{item.unitPrice.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-serif font-bold text-base text-[#253451]">
                  ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                </span>

                {item.productId && (
                  <Link
                    href={`/passport/${item.productId}`}
                    className="bg-amber-50 hover:bg-amber-100 text-[#B65F43] border border-amber-200 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>View Craft Passport</span>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Destination & Support */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        <div className="bg-white p-6 rounded-3xl border border-[#E8E2D6] shadow-sm space-y-2">
          <span className="font-bold text-gray-400 uppercase tracking-wider block mb-1">
            Shipping Destination (India)
          </span>
          <div className="font-bold text-sm text-[#253451]">{order.shippingAddress?.fullName}</div>
          <div className="text-gray-600">{order.shippingAddress?.addressLine1}</div>
          {order.shippingAddress?.addressLine2 && (
            <div className="text-gray-600">{order.shippingAddress?.addressLine2}</div>
          )}
          <div className="text-gray-600">
            {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}
          </div>
          <div className="text-gray-500 pt-1">Phone: {order.shippingAddress?.phone}</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E8E2D6] shadow-sm space-y-3">
          <span className="font-bold text-gray-400 uppercase tracking-wider block mb-1">
            Artisan Workshop Guarantee
          </span>
          <p className="text-gray-600 leading-relaxed">
            Your piece is prepared with traditional heritage care. We inspect every piece to ensure authentic
            provenance before dispatch.
          </p>
          <div className="flex gap-3 pt-2">
            <Link
              href="/explore"
              className="bg-[#253451] hover:bg-[#34486E] text-white px-4 py-2 rounded-xl font-medium transition-colors"
            >
              Back to Marketplace
            </Link>
            <Link
              href="/orders"
              className="text-[#253451] hover:underline px-3 py-2 font-medium"
            >
              All My Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
