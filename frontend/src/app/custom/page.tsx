'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { CustomRequest } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import {
  Palette,
  Sparkles,
  Plus,
  Image as ImageIcon,
  Clock,
  Shield,
  ArrowRight,
  CheckCircle2,
  Lock,
  Globe,
  Upload,
  Calendar,
  Loader2,
} from 'lucide-react';

export default function CustomCommissionPage() {
  const { user, isBuyer, demoLogin } = useAuth();
  const [requests, setRequests] = useState<CustomRequest[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [craftType, setCraftType] = useState('Kasuti Embroidery');
  const [budgetMin, setBudgetMin] = useState(4000);
  const [budgetMax, setBudgetMax] = useState(7500);
  const [desiredDate, setDesiredDate] = useState('2026-12-25');
  const [referenceImageUrl, setReferenceImageUrl] = useState(
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'
  );
  const [isPrivate, setIsPrivate] = useState(false);
  const [sizePreference, setSizePreference] = useState('24x36 inches');
  const [colorPreference, setColorPreference] = useState('Indigo, Madder Red, Gold');

  const loadRequests = async () => {
    setIsLoading(true);
    try {
      const res = await api.getCustomRequests();
      setRequests(res.requests);
    } catch (err) {
      console.error('Error loading custom requests:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      await demoLogin('buyer');
    }

    setIsSubmitting(true);
    try {
      const res = await api.createCustomRequest({
        title,
        description,
        craftType,
        preferences: {
          size: sizePreference,
          colors: colorPreference,
        },
        referenceImageUrl,
        isPrivate,
        budgetMin,
        budgetMax,
        desiredDate,
      });

      alert('Custom design request submitted! Master artisans will review and send proposals.');
      setTitle('');
      setDescription('');
      setShowCreateForm(false);
      loadRequests();
    } catch (err: any) {
      alert('Failed to submit request: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Hero Banner */}
      <div className="bg-[#253451] text-white p-8 sm:p-12 rounded-3xl border-2 border-[#C5A56A] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C5A56A] uppercase tracking-wider">
            <Palette className="w-4 h-4 text-[#B65F43]" />
            <span>CreateConnect • Bespoke Artisan Commissions</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">
            Commission What You Imagine
          </h1>
          <p className="text-sm text-gray-300 leading-relaxed">
            Directly connect with certified master artisans across India. Upload an inspiration photo or
            describe your idea, specify preferences and budget, and receive bespoke proposals with transparent
            artisan wages and milestone tracking.
          </p>
        </div>

        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-[#B65F43] hover:bg-[#974931] text-white px-6 py-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition-all shrink-0 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{showCreateForm ? 'Close Form' : 'Request a Custom Design'}</span>
        </button>
      </div>

      {/* Creation Wizard Form */}
      {showCreateForm && (
        <form
          onSubmit={handleCreateRequest}
          className="bg-white p-6 sm:p-10 rounded-3xl border-2 border-[#C5A56A] shadow-xl space-y-6 animate-in fade-in"
        >
          <div className="border-b border-[#E8E2D6] pb-4">
            <h2 className="font-serif text-2xl font-bold text-[#253451]">
              Submit Custom Craft Request
            </h2>
            <p className="text-xs text-[#5C5853] mt-1">
              Provide as much detail as possible so traditional makers can quote accurate materials and timelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="md:col-span-2">
              <label className="block font-semibold text-gray-700 mb-1">
                Commission Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Bespoke Wedding Kasuti Wall Hanging on Tussar Silk"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#FAF7F0] border border-[#E8E2D6] rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#B65F43]"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Heritage Craft Tradition <span className="text-red-500">*</span>
              </label>
              <select
                value={craftType}
                onChange={(e) => setCraftType(e.target.value)}
                className="w-full bg-[#FAF7F0] border border-[#E8E2D6] rounded-xl p-3 text-sm font-medium"
              >
                <option value="Kasuti Embroidery">Kasuti Embroidery (Karnataka)</option>
                <option value="Blue Pottery">Blue Pottery (Jaipur, Rajasthan)</option>
                <option value="Channapatna Lacquerware">Channapatna Woodwork (Karnataka)</option>
                <option value="Dhokra Metalcraft">Dhokra Lost-Wax Brass (Bastar/Odisha)</option>
                <option value="Pattachitra Painting">Pattachitra Folk Art (Odisha)</option>
                <option value="Other Traditional Craft">Other Traditional Craft</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Desired Completion Date
              </label>
              <input
                type="date"
                value={desiredDate}
                onChange={(e) => setDesiredDate(e.target.value)}
                className="w-full bg-[#FAF7F0] border border-[#E8E2D6] rounded-xl p-3 text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-gray-700 mb-1">
                Detailed Design Description & Requirements <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                placeholder="Describe dimensions, patterns (e.g. temple gopuram, peacocks), intended use (framing, wearing), or sentimental heirlooms..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#FAF7F0] border border-[#E8E2D6] rounded-xl p-3 text-sm leading-relaxed"
              />
            </div>

            {/* Budget Range in INR */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Minimum Budget (₹ INR) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min={500}
                value={budgetMin}
                onChange={(e) => setBudgetMin(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#FAF7F0] border border-[#E8E2D6] rounded-xl p-3 text-sm font-bold text-[#253451]"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Maximum Budget (₹ INR) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min={budgetMin}
                value={budgetMax}
                onChange={(e) => setBudgetMax(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#FAF7F0] border border-[#E8E2D6] rounded-xl p-3 text-sm font-bold text-[#B65F43]"
              />
            </div>

            {/* Size & Color Preferences */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Dimensions / Size</label>
              <input
                type="text"
                placeholder="e.g. 24x36 inches, or Large"
                value={sizePreference}
                onChange={(e) => setSizePreference(e.target.value)}
                className="w-full bg-[#FAF7F0] border border-[#E8E2D6] rounded-xl p-3 text-sm"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Color Palette</label>
              <input
                type="text"
                placeholder="e.g. Natural indigo, mustard, gold zari"
                value={colorPreference}
                onChange={(e) => setColorPreference(e.target.value)}
                className="w-full bg-[#FAF7F0] border border-[#E8E2D6] rounded-xl p-3 text-sm"
              />
            </div>

            {/* Reference Image */}
            <div className="md:col-span-2 space-y-2">
              <label className="block font-semibold text-gray-700">
                Inspiration / Reference Image URL
              </label>
              <input
                type="url"
                value={referenceImageUrl}
                onChange={(e) => setReferenceImageUrl(e.target.value)}
                className="w-full bg-[#FAF7F0] border border-[#E8E2D6] rounded-xl p-3 text-sm"
              />
              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-gray-700">
                  <input
                    type="checkbox"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                    className="rounded text-[#B65F43] focus:ring-[#B65F43]"
                  />
                  <span>Private Request (Only visible to invited artisans)</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#E8E2D6]">
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="px-5 py-2.5 text-xs text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#B65F43] hover:bg-[#974931] text-white px-7 py-3 rounded-xl text-xs font-semibold shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Submit Custom Request to Artisans</span>
            </button>
          </div>
        </form>
      )}

      {/* Active Requests List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D6]">
          <h2 className="font-serif text-2xl font-bold text-[#253451]">
            Active Custom Commissions ({requests.length})
          </h2>
          <span className="text-xs text-gray-500 font-medium">
            Open for proposals & review
          </span>
        </div>

        {isLoading ? (
          <div className="text-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-[#B65F43] mx-auto" />
            <p className="text-xs text-gray-400 mt-2">Loading custom commission requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-[#E8E2D6] p-6 text-gray-500 text-xs">
            No active custom commissions. Click &quot;Request a Custom Design&quot; above to commission your first piece!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {requests.map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-2xl border border-[#E8E2D6] p-6 shadow-sm flex flex-col justify-between space-y-4 hover:border-[#C5A56A] transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="bg-[#FAF7F0] text-[#B65F43] border border-[#C5A56A]/50 font-bold px-2.5 py-1 rounded-md text-[10px] uppercase">
                      {r.craftType}
                    </span>
                    <span className="text-[11px] font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded capitalize">
                      {r.status.replace('_', ' ')}
                    </span>
                  </div>

                  <Link href={`/custom/${r.id}`}>
                    <h3 className="font-serif text-lg font-bold text-[#253451] hover:text-[#B65F43] transition-colors">
                      {r.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-[#5C5853] line-clamp-2 leading-relaxed">
                    {r.description}
                  </p>

                  {r.referenceImageUrl && (
                    <div className="h-36 rounded-xl overflow-hidden bg-gray-100">
                      <img src={r.referenceImageUrl} alt="Reference" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-gray-400 block">Client Budget</span>
                    <span className="font-serif text-base font-bold text-[#253451]">
                      ₹{r.budgetMin.toLocaleString('en-IN')} - ₹{r.budgetMax.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <Link
                    href={`/custom/${r.id}`}
                    className="bg-[#253451] hover:bg-[#B65F43] text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <span>View Proposals ({r.proposalsCount || r.proposals?.length || 0})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
