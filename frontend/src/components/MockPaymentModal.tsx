'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { api } from '@/lib/api';
import { Order } from '@/lib/types';
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Lock,
  AlertTriangle,
  X,
  Loader2,
  Sparkles,
} from 'lucide-react';

interface MockPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
  onPaymentSuccess: (confirmedOrder: Order) => void;
}

export default function MockPaymentModal({
  isOpen,
  onClose,
  order,
  onPaymentSuccess,
}: MockPaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('demo.artisan@okaxis');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleProcessPayment = async () => {
    setIsProcessing(true);
    setErrorMsg('');

    try {
      // 1. Request payment initiation from server
      const paymentOrder = await api.createPaymentOrder(order.id);

      // 2. Perform server-side signature verification / demo confirmation
      const verifyRes = await api.verifyPayment({
        orderId: order.id,
        razorpayOrderId: paymentOrder.razorpayOrderId || `DEMO-RZP-${order.id}`,
        razorpayPaymentId: paymentOrder.mockPaymentId || `pay_demo_${Date.now()}`,
        razorpaySignature: 'mock_verified_signature',
        isMock: true,
      });

      // Confetti celebration
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#B65F43', '#C5A56A', '#253451'],
      });

      onPaymentSuccess(verifyRes.order);
      onClose();
    } catch (err: any) {
      setErrorMsg('Payment verification failed: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-[#FAF7F0] border-2 border-[#C5A56A] rounded-2xl shadow-2xl overflow-hidden text-[#272522]">
        {/* Banner: Clearly Labelled Mock / Test Mode Checkout */}
        <div className="bg-amber-500 text-[#253451] px-4 py-2 flex items-center justify-between text-xs font-bold border-b border-amber-600">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#253451]" />
            <span>DEMO CHECKOUT • TEST MODE ONLY</span>
          </div>
          <span className="text-[10px] bg-black/10 px-2 py-0.5 rounded">No Real Money Charged</span>
        </div>

        {/* Header */}
        <div className="bg-[#253451] text-[#FAF7F0] p-5 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-semibold text-[#C5A56A] uppercase tracking-wider">
              Kala Vaibhav Secure Gateway
            </div>
            <h3 className="font-serif text-xl font-bold text-white mt-0.5">
              Complete Artisan Order
            </h3>
            <div className="text-xs text-gray-300 mt-1">
              Order No: <span className="font-mono text-[#E8D8B6]">{order.orderNumber}</span>
            </div>
          </div>

          <button onClick={onClose} className="p-1 rounded text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Amount Box */}
        <div className="p-6 space-y-5">
          <div className="bg-white p-4 rounded-xl border border-[#E8E2D6] flex items-center justify-between shadow-sm">
            <div>
              <div className="text-xs text-gray-500">Total Payable to Master Artisans</div>
              <div className="font-serif text-2xl font-bold text-[#253451]">
                ₹{order.totalAmount.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md font-semibold border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Fair Trade Escrow</span>
              </span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
              Select Test Payment Instrument:
            </label>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-3 rounded-xl border text-center font-medium transition-all ${
                  paymentMethod === 'upi'
                    ? 'border-[#B65F43] bg-amber-50/60 text-[#B65F43] shadow-xs'
                    : 'border-[#E8E2D6] bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                UPI / QR
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-xl border text-center font-medium transition-all ${
                  paymentMethod === 'card'
                    ? 'border-[#B65F43] bg-amber-50/60 text-[#B65F43] shadow-xs'
                    : 'border-[#E8E2D6] bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Debit/Credit
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('netbanking')}
                className={`p-3 rounded-xl border text-center font-medium transition-all ${
                  paymentMethod === 'netbanking'
                    ? 'border-[#B65F43] bg-amber-50/60 text-[#B65F43] shadow-xs'
                    : 'border-[#E8E2D6] bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                NetBanking
              </button>
            </div>

            {/* Instrument Details (Pre-filled mock) */}
            <div className="bg-white p-3.5 rounded-xl border border-[#E8E2D6] text-xs space-y-2">
              <div className="flex items-center justify-between text-gray-500">
                <span>Demo Virtual VPA:</span>
                <span className="font-mono text-[#253451] font-semibold">{upiId}</span>
              </div>
              <p className="text-[11px] text-gray-400">
                Simulates Razorpay Test Webhook & Signature verification cycle directly on the Go server.
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs">
              {errorMsg}
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handleProcessPayment}
            disabled={isProcessing}
            className="w-full bg-[#B65F43] hover:bg-[#974931] text-white py-3.5 rounded-xl text-sm font-semibold shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isProcessing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Lock className="w-4 h-4" />
            )}
            <span>
              {isProcessing
                ? 'Verifying Server Signature...'
                : `Simulate Successful Payment of ₹${order.totalAmount.toLocaleString('en-IN')}`}
            </span>
          </button>

          <div className="text-center text-[11px] text-gray-500 flex items-center justify-center gap-1.5">
            <Lock className="w-3 h-3 text-emerald-600" />
            <span>256-bit SSL encrypted test transaction</span>
          </div>
        </div>
      </div>
    </div>
  );
}
