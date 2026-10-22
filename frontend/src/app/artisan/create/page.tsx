'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { ExtractedProductDetails } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import KalaMitraVoiceModal from '@/components/KalaMitraVoiceModal';
import PricingAssistantModal from '@/components/PricingAssistantModal';
import {
  Mic,
  Camera,
  Upload,
  Sparkles,
  Calculator,
  CheckCircle2,
  AlertCircle,
  Eye,
  ShieldCheck,
  RotateCcw,
  Clock,
  ArrowRight,
  Loader2,
} from 'lucide-react';

function CreateProductContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isArtisan, demoLogin } = useAuth();

  // Voice & Pricing Modal states
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [pricingModalOpen, setPricingModalOpen] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [craftType, setCraftType] = useState('Kasuti Embroidery');
  const [category, setCategory] = useState('Textiles & Embroidery');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(800);
  const [materials, setMaterials] = useState('');
  const [timeToMake, setTimeToMake] = useState('3 days');
  const [stockQuantity, setStockQuantity] = useState(5);
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80'
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [explicitApproved, setExplicitApproved] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Handle prefill if passed from voice modal
  useEffect(() => {
    const prefillStr = searchParams.get('prefill');
    if (prefillStr) {
      try {
        const data: ExtractedProductDetails = JSON.parse(decodeURIComponent(prefillStr));
        applyExtractedDetails(data);
      } catch (e) {
        console.warn('Could not parse prefill:', e);
      }
    }
  }, [searchParams]);

  const applyExtractedDetails = (details: ExtractedProductDetails) => {
    setTitle(details.productName || '');
    if (details.craftType) setCraftType(details.craftType);
    if (details.category) setCategory(details.category);
    if (details.price) setPrice(details.price);
    if (details.materials) setMaterials(details.materials);
    if (details.timeToMake) setTimeToMake(details.timeToMake);
    if (details.description) setDescription(details.description);
    if (details.stockQuantity) setStockQuantity(details.stockQuantity);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await api.uploadFile(file);
      // Construct full URL
      setImageUrl(`http://localhost:8080${res.url}`);
    } catch (err: any) {
      alert('Upload failed: ' + err.message);
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!explicitApproved) {
      setErrorMsg('Please explicitly review and approve your product listing details before publishing.');
      return;
    }

    if (!user || !isArtisan) {
      // Auto-switch to demo artisan for testing convenience
      await demoLogin('artisan');
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await api.createProduct({
        title,
        craftType,
        category,
        description,
        price,
        materials,
        timeToMake,
        stockQuantity,
        region: user?.region || 'Karnataka',
        imageUrls: [imageUrl],
      });

      alert('Product published successfully to Kala Vaibhav marketplace!');
      router.push(`/products/${res.product.id}`);
    } catch (err: any) {
      setErrorMsg('Failed to publish listing: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sampleImages = [
    { label: 'Kasuti Bag', url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80' },
    { label: 'Blue Pottery Vase', url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80' },
    { label: 'Channapatna Toys', url: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80' },
    { label: 'Handloom Saree', url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Banner: Kala Mitra Voice Hero */}
      <div className="bg-[#253451] text-white p-6 sm:p-8 rounded-3xl border-2 border-[#C5A56A] shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C5A56A] uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#B65F43]" />
            <span>Voice-First Artisan Studio</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
            Create Your Craft Listing
          </h1>
          <p className="text-xs text-gray-300 max-w-lg leading-relaxed">
            Speak to sell in your regional language or use our text studio. Kala Mitra validates your details
            and issues an automatic Digital Craft Passport upon publication.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setVoiceModalOpen(true)}
          className="bg-[#B65F43] hover:bg-[#974931] text-white px-6 py-3.5 rounded-2xl text-xs font-bold flex items-center gap-3 shadow-lg hover:scale-105 transition-all shrink-0"
        >
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Mic className="w-4 h-4 animate-pulse" />
          </div>
          <div className="text-left">
            <span className="block text-[10px] text-amber-200 uppercase font-sans">One-Click AI</span>
            <span>Speak Product Details</span>
          </div>
        </button>
      </div>

      {/* Main Listing Form */}
      <form onSubmit={handlePublish} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Listing Inputs */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E2D6] shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h2 className="font-serif font-bold text-lg text-[#253451]">
              Craft Specifications
            </h2>
            <button
              type="button"
              onClick={() => setPricingModalOpen(true)}
              className="text-xs text-[#B65F43] hover:text-[#974931] font-semibold flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Transparent Pricing Assistant</span>
            </button>
          </div>

          <div className="space-y-4 text-xs">
            {/* Title */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Product Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                placeholder="e.g. Handmade Kasuti Mulberry Silk Bag"
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#FAF7F0] border border-[#E8E2D6] rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#B65F43]"
              />
            </div>

            {/* Craft Type & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Heritage Craft Tradition <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={craftType}
                  placeholder="e.g. Kasuti Embroidery, Jaipur Blue Pottery"
                  onChange={(e) => setCraftType(e.target.value)}
                  className="w-full bg-[#FAF7F0] border border-[#E8E2D6] rounded-xl p-3 text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Marketplace Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#FAF7F0] border border-[#E8E2D6] rounded-xl p-3 text-sm font-medium"
                >
                  <option value="Textiles & Embroidery">Textiles & Embroidery</option>
                  <option value="Pottery & Ceramics">Pottery & Ceramics</option>
                  <option value="Toys & Living">Toys & Living</option>
                  <option value="Metalcraft & Brass">Metalcraft & Brass</option>
                  <option value="Paintings & Folk Art">Paintings & Folk Art</option>
                </select>
              </div>
            </div>

            {/* Price & Stock */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-gray-700 mb-1">
                  Selling Price (₹ INR) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-gray-500 font-bold">₹</span>
                  <input
                    type="number"
                    required
                    min={50}
                    value={price}
                    onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-3 py-3 bg-[#FAF7F0] border border-[#E8E2D6] rounded-xl text-base font-bold text-[#B65F43]"
                  />
                </div>
                <span className="text-[10px] text-gray-400 mt-0.5 block">
                  You receive 100% of this amount upon order delivery.
                </span>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Available Stock <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(parseInt(e.target.value) || 1)}
                  className="w-full p-3 bg-[#FAF7F0] border border-[#E8E2D6] rounded-xl text-sm"
                />
              </div>
            </div>

            {/* Time to Make & Materials */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Time Taken to Make <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={timeToMake}
                  placeholder="e.g. 3 days, 18 hours"
                  onChange={(e) => setTimeToMake(e.target.value)}
                  className="w-full bg-[#FAF7F0] border border-[#E8E2D6] rounded-xl p-3 text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Natural Materials Used
                </label>
                <input
                  type="text"
                  value={materials}
                  placeholder="e.g. Mulberry Silk, Cotton Thread, Hale Wood"
                  onChange={(e) => setMaterials(e.target.value)}
                  className="w-full bg-[#FAF7F0] border border-[#E8E2D6] rounded-xl p-3 text-sm"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Product Story & Technique Description <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={description}
                placeholder="Explain the hand technique, traditional motifs, or family heritage behind this piece..."
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#FAF7F0] border border-[#E8E2D6] rounded-xl p-3 text-sm leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Right Side: Photo Upload & Publication Review */}
        <div className="lg:col-span-5 space-y-6">
          {/* Photo Management Card */}
          <div className="bg-white p-6 rounded-3xl border border-[#E8E2D6] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-serif font-bold text-base text-[#253451]">
                Product Photograph
              </h3>
              <span className="text-[11px] text-[#B65F43] font-semibold">Real Craft Photo</span>
            </div>

            {/* Active Image Preview */}
            <div className="relative h-56 rounded-2xl overflow-hidden bg-gray-100 border border-[#E8E2D6]">
              <img src={imageUrl} alt="Craft Preview" className="w-full h-full object-cover" />
            </div>

            {/* Custom URL or Local File Upload */}
            <div className="space-y-2 text-xs">
              <label className="block font-semibold text-gray-700">Image URL or Upload:</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full bg-[#FAF7F0] border border-[#E8E2D6] rounded-xl p-2.5 text-xs"
              />

              <div className="pt-2 flex items-center justify-between text-xs">
                <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload from Device</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
                <span className="text-[10px] text-gray-400">JPG, PNG, WebP up to 20MB</span>
              </div>
            </div>

            {/* Sample Asset Picker for Hackathon Judges */}
            <div className="pt-3 border-t border-gray-100">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                Sample Heritage Photos (Click to choose):
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {sampleImages.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setImageUrl(s.url)}
                    className={`p-1.5 rounded-lg border text-left flex items-center gap-2 transition-all ${
                      imageUrl === s.url ? 'border-[#B65F43] bg-amber-50/50' : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <img src={s.url} alt="" className="w-8 h-8 rounded object-cover" />
                    <span className="text-[10px] font-medium text-gray-700 truncate">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Explicit Artisan Approval & Publish Box */}
          <div className="bg-[#FAF7F0] border-2 border-[#C5A56A] p-6 rounded-3xl shadow-md space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#253451] uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-[#B65F43]" />
              <span>Artisan Final Review</span>
            </div>

            <div className="text-xs text-gray-700 space-y-2">
              <p>
                By publishing, a verified <strong>Digital Craft Passport</strong> will be automatically linked to this
                piece under serial number <strong>KV-PASSPORT-2026</strong>.
              </p>
              <label className="flex items-start gap-2.5 pt-2 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={explicitApproved}
                  onChange={(e) => setExplicitApproved(e.target.checked)}
                  className="mt-0.5 rounded border-gray-300 text-[#B65F43] focus:ring-[#B65F43]"
                />
                <span className="text-[11px] font-semibold text-gray-800">
                  I explicitly confirm that the price of ₹{price} and product details are accurate and
                  represent my handmade craft.
                </span>
              </label>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !explicitApproved}
              className="w-full bg-[#B65F43] hover:bg-[#974931] disabled:opacity-50 text-white py-3.5 rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all hover:scale-102"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              <span>Publish Craft to Marketplace</span>
            </button>
          </div>
        </div>
      </form>

      {/* Voice Assistant Modal */}
      <KalaMitraVoiceModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
        onConfirmListing={(details) => applyExtractedDetails(details)}
      />

      {/* Pricing Assistant Modal */}
      <PricingAssistantModal
        isOpen={pricingModalOpen}
        onClose={() => setPricingModalOpen(false)}
        craftType={craftType}
        initialPrice={price}
        onApplyPrice={(newPrice) => setPrice(newPrice)}
      />
    </div>
  );
}

export default function CreateProductPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-gray-500">Loading studio...</div>}>
      <CreateProductContent />
    </Suspense>
  );
}
