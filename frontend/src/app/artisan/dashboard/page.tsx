'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Product, CustomRequest, Order } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import {
  Package,
  ShoppingBag,
  Palette,
  TrendingUp,
  Plus,
  Mic,
  Clock,
  Eye,
  Trash2,
  Send,
  CheckCircle,
  AlertCircle,
  MapPin,
  ChevronRight,
  ShieldCheck,
  Loader2,
} from 'lucide-react';

export default function ArtisanDashboardPage() {
  const { user, isArtisan, demoLogin } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [customRequests, setCustomRequests] = useState<CustomRequest[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Proposal modal state
  const [selectedRequest, setSelectedRequest] = useState<CustomRequest | null>(null);
  const [proposedPrice, setProposedPrice] = useState(5500);
  const [estimatedDays, setEstimatedDays] = useState(14);
  const [proposalMessage, setProposalMessage] = useState('');
  const [isSubmittingProposal, setIsSubmittingProposal] = useState(false);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // 1. Load artisan products
      const prodRes = await api.getProducts({ artisanId: user?.id });
      setProducts(prodRes.products);

      // 2. Load custom requests
      const customRes = await api.getCustomRequests();
      setCustomRequests(customRes.requests);

      // 3. Load orders
      const orderRes = await api.getMyOrders().catch(() => ({ orders: [] }));
      setOrders(orderRes.orders || []);
    } catch (err) {
      console.error('Error loading artisan dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isArtisan && user) {
      // Prompt or auto-switch to artisan
      demoLogin('artisan');
    }
    loadDashboardData();
  }, [user]);

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    try {
      await api.deleteProduct(productId);
      setProducts(products.filter((p) => p.id !== productId));
    } catch (err: any) {
      alert('Delete failed: ' + err.message);
    }
  };

  const handleSendProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;
    setIsSubmittingProposal(true);
    try {
      await api.submitProposal(selectedRequest.id, {
        proposedPrice,
        estimatedDays,
        message: proposalMessage,
      });
      alert('Proposal submitted to client successfully!');
      setSelectedRequest(null);
      loadDashboardData();
    } catch (err: any) {
      alert('Failed to submit proposal: ' + err.message);
    } finally {
      setIsSubmittingProposal(false);
    }
  };

  const totalVolume = products.reduce((acc, p) => acc + p.price * (p.stockQuantity || 1), 0);
  const activeCount = products.filter((p) => p.status === 'active').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header & Persona Card */}
      <div className="bg-[#253451] text-white p-6 sm:p-8 rounded-3xl border-2 border-[#C5A56A] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'}
            alt={user?.fullName || 'Artisan'}
            className="w-16 h-16 rounded-full object-cover border-2 border-[#C5A56A]"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-[#B65F43] text-white font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                Master Artisan
              </span>
              <span className="text-xs text-[#E8D8B6] flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {user?.region || 'Karnataka'}
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white mt-0.5">
              Namaste, {user?.fullName || 'Sunita Devi'}
            </h1>
            <p className="text-xs text-gray-300 mt-1">
              Welcome to your artisan studio. Manage listings, review custom commissions, and fulfill orders.
            </p>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Link
            href="/artisan/create"
            className="bg-[#B65F43] hover:bg-[#974931] text-white px-5 py-3 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition-all hover:scale-102"
          >
            <Mic className="w-4 h-4 animate-pulse text-[#FAF7F0]" />
            <span>Create Listing (Kala Mitra)</span>
          </Link>
        </div>
      </div>

      {/* 4 Core Questions: Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-[#E8E2D6] shadow-sm">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>What have I listed?</span>
            <Package className="w-4 h-4 text-[#B65F43]" />
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-[#253451]">
            {products.length}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">
            {activeCount} active in marketplace
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E2D6] shadow-sm">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>What orders received?</span>
            <ShoppingBag className="w-4 h-4 text-[#C5A56A]" />
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-[#253451]">
            {orders.length || 1}
          </div>
          <div className="text-[11px] text-gray-500 mt-1">
            1 ready for shipment
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E2D6] shadow-sm">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>Custom Requests?</span>
            <Palette className="w-4 h-4 text-[#B65F43]" />
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-[#253451]">
            {customRequests.length}
          </div>
          <div className="text-[11px] text-[#B65F43] font-semibold mt-1">
            Open for your proposals
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E2D6] shadow-sm">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>Listed Studio Value</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-[#253451]">
            ₹{totalVolume.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-gray-500 mt-1">
            Fair trade value in stock
          </div>
        </div>
      </div>

      {/* Actionable "What should I do next?" Banner */}
      <div className="bg-amber-50/70 border border-[#C5A56A] p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-[#B65F43] shrink-0 mt-0.5" />
          <div>
            <h4 className="font-serif font-bold text-sm text-[#253451]">
              Next Step: New Custom Wedding Request Available
            </h4>
            <p className="text-xs text-[#5C5853] mt-0.5">
              Anamika Sharma submitted a custom request for a &quot;Wedding Kasuti Wall Hanging&quot; with a budget of
              ₹4,500 - ₹7,000. Review specifications and send your proposal below.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            const el = document.getElementById('custom-requests-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="bg-[#253451] hover:bg-[#34486E] text-white px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-colors"
        >
          View Requests
        </button>
      </div>

      {/* Section 1: My Listed Crafts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#E8E2D6]">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#253451] flex items-center gap-2">
            <Package className="w-5 h-5 text-[#B65F43]" />
            <span>My Listed Crafts ({products.length})</span>
          </h2>

          <Link
            href="/artisan/create"
            className="text-xs font-semibold text-[#B65F43] hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Craft</span>
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-[#E8E2D6] p-6">
            <p className="text-xs text-gray-500 font-medium">No products listed in your studio yet.</p>
            <Link
              href="/artisan/create"
              className="mt-3 inline-flex items-center gap-2 bg-[#B65F43] text-white px-4 py-2 rounded-lg text-xs font-semibold"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Create First Listing with Kala Mitra</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-[#E8E2D6] p-4 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div className="flex gap-4">
                  <img
                    src={p.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=400&q=80'}
                    alt={p.title}
                    className="w-20 h-20 rounded-xl object-cover border border-gray-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-[#B65F43] font-bold uppercase tracking-wider block">
                      {p.craftType}
                    </span>
                    <h3 className="font-serif font-bold text-sm text-[#253451] truncate">
                      {p.title}
                    </h3>
                    <div className="font-serif font-bold text-[#B65F43] text-base mt-1">
                      ₹{p.price.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[11px] text-gray-500">
                      Stock: {p.stockQuantity} units • {p.timeToMake}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <Link
                    href={`/products/${p.id}`}
                    className="text-[#253451] hover:text-[#B65F43] font-semibold flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview Live</span>
                  </Link>

                  <button
                    onClick={() => handleDeleteProduct(p.id)}
                    className="text-red-500 hover:text-red-700 flex items-center gap-1 text-[11px]"
                    title="Delete product"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: Incoming Custom Requests (CreateConnect) */}
      <div id="custom-requests-section" className="space-y-4 pt-6 border-t border-[#E8E2D6]">
        <div className="flex items-center justify-between pb-2 border-b border-[#E8E2D6]">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#253451] flex items-center gap-2">
              <Palette className="w-5 h-5 text-[#B65F43]" />
              <span>Incoming Custom Design Requests (CreateConnect)</span>
            </h2>
            <p className="text-xs text-[#5C5853] mt-0.5">
              Clients seeking bespoke heirloom craft pieces. Submit your proposal and timeline.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {customRequests.map((req) => (
            <div
              key={req.id}
              className="bg-white p-6 rounded-2xl border border-[#E8E2D6] shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex gap-4">
                  {req.referenceImageUrl && (
                    <img
                      src={req.referenceImageUrl}
                      alt="Reference"
                      className="w-20 h-20 rounded-xl object-cover border border-gray-200 shrink-0"
                    />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded uppercase">
                        {req.craftType}
                      </span>
                      <span className="text-xs text-gray-500">
                        Client: <strong>{req.buyerName || 'Client'}</strong>
                      </span>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-[#253451] mt-1">
                      {req.title}
                    </h3>

                    <p className="text-xs text-[#5C5853] mt-1 leading-relaxed max-w-2xl">
                      {req.description}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs text-gray-400">Budget Range</div>
                  <div className="font-serif text-lg font-bold text-[#253451]">
                    ₹{req.budgetMin.toLocaleString('en-IN')} - ₹{req.budgetMax.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-0.5">
                    Target: {req.desiredDate || 'Flexible'}
                  </div>
                </div>
              </div>

              {/* Proposals Received */}
              {req.proposals && req.proposals.length > 0 && (
                <div className="bg-[#FAF7F0] p-4 rounded-xl text-xs space-y-2 border border-[#E8E2D6]">
                  <span className="font-bold text-[#253451] block uppercase text-[10px]">
                    Active Proposals on this Request ({req.proposals.length}):
                  </span>
                  {req.proposals.map((prop) => (
                    <div key={prop.id} className="flex justify-between items-center text-gray-700">
                      <span>
                        <strong>{prop.artisanName}:</strong> Quote: ₹{prop.proposedPrice} • {prop.estimatedDays} days
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                          prop.status === 'accepted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        {prop.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Submit Proposal Button */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    setSelectedRequest(req);
                    setProposedPrice(req.budgetMin + (req.budgetMax - req.budgetMin) / 2);
                  }}
                  className="bg-[#253451] hover:bg-[#34486E] text-white px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Artisan Quotation & Timeline</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Proposal Submission Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#FAF7F0] border-2 border-[#C5A56A] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200">
              <h3 className="font-serif font-bold text-lg text-[#253451]">
                Submit Custom Proposal
              </h3>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-gray-400 hover:text-gray-700 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-gray-600">
              For: <strong className="text-[#253451]">{selectedRequest.title}</strong>
              <div className="text-[11px] text-gray-500 mt-0.5">
                Client Budget: ₹{selectedRequest.budgetMin} - ₹{selectedRequest.budgetMax}
              </div>
            </div>

            <form onSubmit={handleSendProposal} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Your Proposed Price (₹ INR)
                </label>
                <input
                  type="number"
                  required
                  value={proposedPrice}
                  onChange={(e) => setProposedPrice(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-[#E8E2D6] rounded-xl p-2.5 font-bold text-[#B65F43]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Estimated Making Days
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={estimatedDays}
                  onChange={(e) => setEstimatedDays(parseInt(e.target.value) || 1)}
                  className="w-full bg-white border border-[#E8E2D6] rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Artisan Message to Client
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Namaste, I can handcraft this using traditional techniques..."
                  value={proposalMessage}
                  onChange={(e) => setProposalMessage(e.target.value)}
                  className="w-full bg-white border border-[#E8E2D6] rounded-xl p-2.5 leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedRequest(null)}
                  className="px-4 py-2 border border-gray-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingProposal}
                  className="bg-[#B65F43] hover:bg-[#974931] text-white px-5 py-2 rounded-xl font-semibold shadow disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSubmittingProposal && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Send Proposal</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
