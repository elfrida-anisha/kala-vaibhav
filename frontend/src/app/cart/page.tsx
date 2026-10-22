'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Order, ShippingAddress } from '@/lib/types';
import MockPaymentModal from '@/components/MockPaymentModal';
import {
  ShoppingBag,
  Trash2,
  ShieldCheck,
  Lock,
  ArrowRight,
  MapPin,
  Sparkles,
  Loader2,
  CheckCircle,
} from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeFromCart, clearCart, totalAmount } = useCart();
  const { user, demoLogin } = useAuth();

  const [address, setAddress] = useState<ShippingAddress>({
    fullName: user?.fullName || 'Anamika Sharma',
    phone: '+91 98110 55555',
    addressLine1: '14B, Heritage Palms, Koramangala 4th Block',
    addressLine2: 'Near Wipro Park',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560034',
  });

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    if (!user) {
      await demoLogin('buyer');
    }

    setIsPlacingOrder(true);
    setErrorMsg('');

    try {
      // 1. Submit order to Go server for validation of prices & stock
      const payload = {
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          unitPrice: i.price,
        })),
        shippingAddress: address,
        isDemo: true,
      };

      const res = await api.createOrder(payload);
      setCreatedOrder(res.order);
      setPaymentModalOpen(true);
    } catch (err: any) {
      setErrorMsg('Checkout failed: ' + err.message);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handlePaymentSuccess = (confirmedOrder: Order) => {
    clearCart();
    router.push(`/orders/${confirmedOrder.id}`);
  };

  if (items.length === 0 && !createdOrder) {
    return (
      <div className="max-w-2xl mx-auto py-24 px-4 text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-[#B65F43] flex items-center justify-center mx-auto border border-amber-200">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-[#253451]">
          Your Craft Basket is Empty
        </h2>
        <p className="text-xs text-[#5C5853] max-w-sm mx-auto">
          Explore handcrafted heritage textiles, blue pottery, and wooden lacquerware directly from master artisans.
        </p>
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 bg-[#253451] hover:bg-[#34486E] text-white px-6 py-3 rounded-xl text-xs font-semibold shadow transition-all"
        >
          <span>Explore Handmade Crafts</span>
          <ArrowRight className="w-4 h-4 text-[#C5A56A]" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="border-b border-[#E8E2D6] pb-4">
        <h1 className="font-serif text-3xl font-bold text-[#253451]">
          Craft Basket & Checkout
        </h1>
        <p className="text-xs text-[#5C5853] mt-1">
          Review your authentic artisan selections and specify delivery destination.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-[#E8E2D6] p-6 shadow-sm divide-y divide-gray-100">
            {items.map((item) => (
              <div key={item.productId} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-20 h-20 rounded-xl object-cover border border-gray-100 shrink-0"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-sm text-[#253451]">
                      {item.title}
                    </h3>
                    <div className="text-xs text-gray-500 mt-0.5">
                      By {item.artisanName || 'Master Artisan'}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="font-serif font-bold text-base text-[#B65F43]">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-[#E8E2D6] rounded-lg bg-[#FAF7F0] p-0.5 text-xs">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center font-bold text-gray-600 hover:bg-white rounded"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-bold">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center font-bold text-gray-600 hover:bg-white rounded"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.productId)}
                        className="text-red-400 hover:text-red-600 p-1"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Fair Trade Assurance Note */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-center gap-3 text-xs text-emerald-900">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
            <span>
              <strong>Fair Trade Guarantee:</strong> 100% of the artisan item price goes directly to
              the maker. Each craft includes an official Digital Craft Passport certifying its origin.
            </span>
          </div>
        </div>

        {/* Right Column: India Shipping Address & Summary Form */}
        <div className="lg:col-span-5 space-y-6">
          <form
            onSubmit={handleCheckout}
            className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E2D6] shadow-sm space-y-6"
          >
            <div>
              <h2 className="font-serif font-bold text-lg text-[#253451] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#B65F43]" />
                <span>Shipping Destination (India)</span>
              </h2>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={address.fullName}
                  onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                  className="w-full bg-[#FAF7F0] border border-[#E8E2D6] rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Phone Number (with SMS tracking) *</label>
                <input
                  type="tel"
                  required
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  className="w-full bg-[#FAF7F0] border border-[#E8E2D6] rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Street Address & House / Flat No *</label>
                <input
                  type="text"
                  required
                  value={address.addressLine1}
                  onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                  className="w-full bg-[#FAF7F0] border border-[#E8E2D6] rounded-xl p-2.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full bg-[#FAF7F0] border border-[#E8E2D6] rounded-xl p-2.5"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="w-full bg-[#FAF7F0] border border-[#E8E2D6] rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">PIN Code *</label>
                <input
                  type="text"
                  required
                  value={address.postalCode}
                  onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                  className="w-full bg-[#FAF7F0] border border-[#E8E2D6] rounded-xl p-2.5 font-mono"
                />
              </div>
            </div>

            {/* Price Calculation Summary */}
            <div className="pt-4 border-t border-gray-100 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Items Subtotal:</span>
                <span className="font-semibold text-gray-800">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Insured Heritage Shipping:</span>
                <span className="text-emerald-700 font-semibold">FREE (Platform Covered)</span>
              </div>
              <div className="flex justify-between text-base font-serif font-bold text-[#253451] pt-2 border-t border-gray-100">
                <span>Total Amount:</span>
                <span className="text-[#B65F43]">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={isPlacingOrder}
              className="w-full bg-[#B65F43] hover:bg-[#974931] disabled:opacity-50 text-white py-3.5 rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all hover:scale-102"
            >
              {isPlacingOrder ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
              <span>Proceed to Demo Payment</span>
            </button>
          </form>
        </div>
      </div>

      {/* Payment Gateway Modal (Mock / Razorpay Test Mode) */}
      {createdOrder && (
        <MockPaymentModal
          isOpen={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          order={createdOrder}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
