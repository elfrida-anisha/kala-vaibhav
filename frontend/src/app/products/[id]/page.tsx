'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Product, CraftPassport, CraftJourneyItem } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import DigitalCraftPassportCard from '@/components/DigitalCraftPassportCard';
import CraftJourneyTimeline from '@/components/CraftJourneyTimeline';
import {
  ShieldCheck,
  Clock,
  MapPin,
  ShoppingBag,
  Sparkles,
  Award,
  Layers,
  ChevronRight,
  CheckCircle2,
  Share2,
  Heart,
  Loader2,
  Calendar,
  AlertCircle,
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [passport, setPassport] = useState<CraftPassport | null>(null);
  const [journeyItems, setJourneyItems] = useState<CraftJourneyItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'details' | 'passport' | 'journey'>('details');
  const [showPricingBreakdown, setShowPricingBreakdown] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      setIsLoading(true);
      try {
        const res = await api.getProduct(id);
        setProduct(res.product);
        if (res.passport) setPassport(res.passport);
        if (res.journeyItems) setJourneyItems(res.journeyItems);
        if (res.product.images && res.product.images.length > 0) {
          setSelectedImage(res.product.images[0].imageUrl);
        }
      } catch (err) {
        console.error('Error loading product:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#B65F43]" />
        <p className="text-xs text-gray-500 font-medium">Loading handcrafted masterpiece...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-gray-300 mx-auto" />
        <h2 className="font-serif text-2xl font-bold text-[#253451]">Product Not Found</h2>
        <p className="text-xs text-gray-500">
          The requested craft piece might have been acquired or moved.
        </p>
        <Link
          href="/explore"
          className="inline-block bg-[#253451] text-white px-5 py-2.5 rounded-xl text-xs font-semibold"
        >
          Return to Catalogue
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push('/cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Link href="/" className="hover:text-gray-700">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/explore" className="hover:text-gray-700">Explore Crafts</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#253451] font-medium truncate max-w-xs">{product.title}</span>
      </div>

      {/* Main Grid: Gallery + Purchase Specs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative h-[420px] sm:h-[500px] w-full rounded-2xl overflow-hidden bg-[#FAF7F0] border-2 border-[#E8E2D6] shadow-sm">
            <img
              src={selectedImage || product.images?.[0]?.imageUrl}
              alt={product.title}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute top-4 left-4 bg-[#253451]/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
              {product.craftType}
            </div>
            {passport?.provenanceStatus && (
              <div className="absolute top-4 right-4 bg-white/95 text-[#253451] text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 border border-[#E8E2D6]">
                <ShieldCheck className="w-4 h-4 text-[#B65F43]" />
                <span className="capitalize">{passport.provenanceStatus.replace('-', ' ')}</span>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img.imageUrl)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImage === img.imageUrl
                      ? 'border-[#B65F43] scale-102 shadow-sm'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Master Artisan Bio Card */}
          <div className="bg-white p-5 rounded-2xl border border-[#E8E2D6] shadow-sm flex items-start gap-4">
            <img
              src={product.artisanAvatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'}
              alt={product.artisanName || 'Artisan'}
              className="w-14 h-14 rounded-full object-cover border-2 border-[#C5A56A] shrink-0"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-base text-[#253451]">
                    {product.artisanName || 'Master Maker'}
                  </h4>
                  <div className="flex items-center gap-1 text-xs text-[#5C5853]">
                    <MapPin className="w-3.5 h-3.5 text-[#B65F43]" />
                    <span>{product.artisanRegion || product.region || 'India'}</span>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-200">
                  Verified Master
                </span>
              </div>
              <p className="text-xs text-[#5C5853] mt-2 leading-relaxed">
                Practicing traditional heritage craftsmanship with generational dedication. 100% of your payment directly supports this artisan&apos;s workshop.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing & Purchasing Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E2D6] shadow-sm space-y-6">
            <div>
              <div className="text-xs font-semibold text-[#B65F43] uppercase tracking-wider mb-1">
                {product.category}
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#253451] leading-tight">
                {product.title}
              </h1>

              {/* Price Display */}
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-baseline justify-between">
                <div>
                  <div className="text-xs text-gray-400 font-semibold uppercase">Direct Artisan Price</div>
                  <div className="font-serif text-3xl font-bold text-[#B65F43]">
                    ₹{product.price.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] text-emerald-700 font-medium mt-0.5">
                    Inclusive of all handcrafted fair wages
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-gray-400">Availability</div>
                  <div className={`text-xs font-bold ${product.stockQuantity > 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                    {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Specs Pill Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-[#FAF7F0] p-4 rounded-xl border border-[#E8E2D6]">
              <div>
                <span className="text-gray-400 block mb-0.5 text-[10px] uppercase">Handcraft Time</span>
                <span className="font-semibold text-[#253451] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#B65F43]" />
                  <span>{product.timeToMake || 'Multiple days'}</span>
                </span>
              </div>
              <div>
                <span className="text-gray-400 block mb-0.5 text-[10px] uppercase">Materials</span>
                <span className="font-semibold text-[#253451] truncate block">
                  {product.materials || 'Authentic Natural Fibers'}
                </span>
              </div>
            </div>

            {/* Transparent Pricing Assistance Dropdown */}
            <div className="border border-[#C5A56A]/60 rounded-xl p-3.5 bg-amber-50/40 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowPricingBreakdown(!showPricingBreakdown)}
                  className="font-bold text-[#253451] hover:text-[#B65F43] flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-[#C5A56A]" />
                  <span>See Why This Craft Costs ₹{product.price}</span>
                </button>
                <span className="text-[10px] text-gray-500 font-mono">
                  {showPricingBreakdown ? '▲ Hide' : '▼ View'}
                </span>
              </div>

              {showPricingBreakdown && (
                <div className="pt-2 border-t border-[#C5A56A]/30 space-y-1.5 text-gray-700 animate-in fade-in">
                  <div className="flex justify-between">
                    <span>Authentic Raw Materials & Natural Dyes:</span>
                    <strong className="text-gray-800">₹{(product.price * 0.35).toFixed(0)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Artisan Skilled Handwork ({product.timeToMake}):</span>
                    <strong className="text-gray-800">₹{(product.price * 0.45).toFixed(0)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Workshop Firing, Tools & Safe Packaging:</span>
                    <strong className="text-gray-800">₹{(product.price * 0.20).toFixed(0)}</strong>
                  </div>
                  <p className="text-[10px] text-gray-500 italic pt-1 border-t border-gray-200">
                    Kala Vaibhav charges zero platform commission on this artisan&apos;s direct listing.
                  </p>
                </div>
              )}
            </div>

            {/* Purchase Controls */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-[#E8E2D6] rounded-xl bg-[#FAF7F0] p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-gray-600 hover:bg-white"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-bold text-sm text-[#253451]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-gray-600 hover:bg-white"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={product.stockQuantity === 0}
                  className="flex-1 bg-[#FAF7F0] hover:bg-[#B65F43] text-[#253451] hover:text-white border-2 border-[#C5A56A] hover:border-[#B65F43] py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
              </div>

              <button
                onClick={handleBuyNow}
                disabled={product.stockQuantity === 0}
                className="w-full bg-[#B65F43] hover:bg-[#974931] text-white py-3.5 rounded-xl text-sm font-bold shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <span>Proceed to Checkout</span>
              </button>

              {addedToast && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Added {quantity} item(s) to your craft basket!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Deep-Dive Tabs: Provenance Passport & Making Journey */}
      <div className="pt-6 border-t border-[#E8E2D6] space-y-6">
        <div className="flex border-b border-[#E8E2D6] text-sm font-semibold">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-3 px-6 border-b-2 transition-all ${
              activeTab === 'details'
                ? 'border-[#B65F43] text-[#B65F43]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            Product Story & Craft Heritage
          </button>
          <button
            onClick={() => setActiveTab('passport')}
            className={`py-3 px-6 border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'passport'
                ? 'border-[#B65F43] text-[#B65F43]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Award className="w-4 h-4 text-[#C5A56A]" />
            <span>Digital Craft Passport</span>
          </button>
          <button
            onClick={() => setActiveTab('journey')}
            className={`py-3 px-6 border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'journey'
                ? 'border-[#B65F43] text-[#B65F43]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Clock className="w-4 h-4 text-[#B65F43]" />
            <span>Craft Journey Timeline ({journeyItems.length})</span>
          </button>
        </div>

        {/* Tab 1: Detailed Story */}
        {activeTab === 'details' && (
          <div className="bg-white p-8 rounded-2xl border border-[#E8E2D6] space-y-6 leading-relaxed text-sm text-[#5C5853]">
            <h3 className="font-serif text-2xl font-bold text-[#253451]">
              About This Handcrafted Piece
            </h3>
            <p className="text-base text-gray-700 leading-relaxed">
              {product.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-100 text-xs">
              <div>
                <strong className="text-[#253451] block mb-1">Authentic Materials:</strong>
                <p>{product.materials || 'Pure natural raw materials locally sourced from artisan clusters.'}</p>
              </div>
              <div>
                <strong className="text-[#253451] block mb-1">Technique & Care:</strong>
                <p>Gentle dry clean or spot hand-wipe with soft muslin cloth. Avoid harsh chemicals.</p>
              </div>
              <div>
                <strong className="text-[#253451] block mb-1">Origin & Heritage:</strong>
                <p>{product.region || 'Karnataka, India'} • Certified Geographical Indication provenance.</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Embedded Digital Craft Passport */}
        {activeTab === 'passport' && (
          <DigitalCraftPassportCard
            passport={passport}
            productId={product.id}
            artisanName={product.artisanName}
          />
        )}

        {/* Tab 3: Craft Journey Timeline */}
        {activeTab === 'journey' && (
          <CraftJourneyTimeline
            productId={product.id}
            artisanId={product.artisanId}
            initialItems={journeyItems}
          />
        )}
      </div>
    </div>
  );
}
