'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Product } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import ProductCard from '@/components/ProductCard';
import KalaMitraVoiceModal from '@/components/KalaMitraVoiceModal';
import {
  Mic,
  Compass,
  Palette,
  Award,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Clock,
  Heart,
  Quote,
  Star,
  Layers,
  ChevronRight,
} from 'lucide-react';

export default function HomePage() {
  const { demoLogin, isArtisan } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await api.getProducts();
        setFeaturedProducts(res.products.slice(0, 4));
      } catch (e) {
        console.warn('Could not load featured products:', e);
      }
    }
    loadFeatured();
  }, []);

  const categories = [
    {
      name: 'Textiles & Embroidery',
      description: 'Kasuti of Karnataka, Chanderi silks, Phulkari',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
      count: '18 Crafts',
    },
    {
      name: 'Pottery & Ceramics',
      description: 'Jaipur Blue Pottery, Terracotta of Gorakhpur',
      image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80',
      count: '12 Crafts',
    },
    {
      name: 'Toys & Living',
      description: 'GI-tagged Channapatna natural lacquerware',
      image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80',
      count: '14 Crafts',
    },
    {
      name: 'Folk Art & Metalcraft',
      description: 'Dhokra lost-wax casting & Pattachitra paintings',
      image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=600&q=80',
      count: '9 Crafts',
    },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-18 lg:pb-28 border-b border-[#E8E2D6] bg-gradient-to-b from-[#FAF7F0] via-amber-50/40 to-[#FAF7F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-[#FAF7F0] text-[#B65F43] border border-[#C5A56A] px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-xs">
                <Sparkles className="w-4 h-4 text-[#C5A56A]" />
                <span>India&apos;s First Voice-First Artisan Marketplace</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#253451] leading-[1.15] tracking-tight">
                Every Craft Has a Story.{' '}
                <span className="text-[#B65F43] block mt-1">Every Artisan Deserves a Market.</span>
              </h1>

              <p className="text-base sm:text-lg text-[#5C5853] max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Empowering master artisans across India through <strong>voice-to-listing</strong>,{' '}
                <strong>Digital Craft Passports</strong>, and custom commissions. Speak to sell. Buy what exists.
                Commission what you imagine.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/explore"
                  className="w-full sm:w-auto px-7 py-3.5 bg-[#253451] hover:bg-[#34486E] text-white rounded-xl text-sm font-semibold shadow-md flex items-center justify-center gap-2 transition-all hover:scale-102"
                >
                  <Compass className="w-4 h-4 text-[#C5A56A]" />
                  <span>Explore Crafts</span>
                </Link>

                <button
                  onClick={() => setVoiceModalOpen(true)}
                  className="w-full sm:w-auto px-7 py-3.5 bg-[#B65F43] hover:bg-[#974931] text-white rounded-xl text-sm font-semibold shadow-md flex items-center justify-center gap-2 transition-all hover:scale-102"
                >
                  <Mic className="w-4 h-4 animate-pulse" />
                  <span>Try Kala Mitra (Speak to Sell)</span>
                </button>

                <Link
                  href="/custom"
                  className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-gray-50 text-[#253451] border border-[#C5A56A] rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Palette className="w-4 h-4 text-[#B65F43]" />
                  <span>Commission Custom Piece</span>
                </Link>
              </div>
            </div>

            {/* Right Visual Frame */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Visual Card 1: Featured Craft */}
                <div className="warm-card p-4 rounded-2xl shadow-xl overflow-hidden border-2 border-[#C5A56A]">
                  <div className="relative h-80 rounded-xl overflow-hidden bg-gray-100">
                    <img
                      src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80"
                      alt="Kasuti Masterpiece"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-[#253451]/90 backdrop-blur-sm text-[#FAF7F0] text-xs font-semibold px-3 py-1 rounded-full">
                      Kasuti Embroidery • Dharwad
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md p-3 rounded-lg border border-[#E8E2D6] text-xs">
                      <div className="flex items-center justify-between font-bold text-[#253451]">
                        <span>Sunita Devi • Master Artisan</span>
                        <span className="text-[#B65F43] font-serif text-sm">₹1,450</span>
                      </div>
                      <div className="text-[11px] text-gray-600 mt-0.5 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Digital Craft Passport Verified • 34 Hours Needlework</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Kala Mitra Speech Pill */}
                <div className="absolute -bottom-6 -left-6 bg-[#253451] text-white p-4 rounded-xl shadow-xl border border-[#C5A56A] max-w-xs hidden sm:block animate-bounce-subtle">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#C5A56A] mb-1">
                    <Mic className="w-3.5 h-3.5 text-[#B65F43]" />
                    <span>Spoken by Artisan Sunita:</span>
                  </div>
                  <p className="text-[11px] italic text-gray-200">
                    &quot;This is a handmade Kasuti bag. The price is 800 rupees. It took me three days to make.&quot;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Signature Feature Showcase: Kala Mitra Voice-to-Listing */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#253451] text-[#FAF7F0] rounded-3xl p-8 sm:p-12 border-4 border-[#C5A56A] relative overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 bg-[#B65F43] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                <Mic className="w-3.5 h-3.5 animate-pulse" />
                <span>Signature Innovation</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Kala Mitra: Speak to Sell in Under 60 Seconds
              </h2>

              <p className="text-sm text-gray-200 leading-relaxed">
                Traditional artisans should never be blocked by complex digital keyboards or English forms.
                With Kala Mitra, the maker simply taps the microphone and speaks in their natural words.
                Our AI extracts craft traditions, pricing, materials, and time-to-make into a verified catalog listing.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs">
                <div className="bg-[#34486E]/50 p-3 rounded-xl border border-[#C5A56A]/30">
                  <div className="font-bold text-[#E8D8B6] mb-1">1. Speak Naturally</div>
                  <p className="text-gray-300 text-[11px]">No tech knowledge required. Speak your item name, price, and days.</p>
                </div>
                <div className="bg-[#34486E]/50 p-3 rounded-xl border border-[#C5A56A]/30">
                  <div className="font-bold text-[#E8D8B6] mb-1">2. AI Field Extraction</div>
                  <p className="text-gray-300 text-[11px]">Structured schema maps craft type, dimensions, and materials.</p>
                </div>
                <div className="bg-[#34486E]/50 p-3 rounded-xl border border-[#C5A56A]/30">
                  <div className="font-bold text-[#E8D8B6] mb-1">3. Artisan Explicit Approval</div>
                  <p className="text-gray-300 text-[11px]">Review pricing and confirm before publishing to marketplace.</p>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-3">
                <button
                  onClick={() => setVoiceModalOpen(true)}
                  className="bg-[#B65F43] hover:bg-[#974931] text-white px-6 py-3 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition-all"
                >
                  <Mic className="w-4 h-4" />
                  <span>Launch Kala Mitra Studio Demo</span>
                </button>

                <Link
                  href="/artisan/create"
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-3 rounded-xl text-xs font-semibold transition-colors"
                >
                  Text-Based Fallback Studio
                </Link>
              </div>
            </div>

            {/* Simulated Voice Waveform & Interactive Card */}
            <div className="lg:col-span-5 bg-[#1C283F] p-6 rounded-2xl border border-[#34486E] space-y-4">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span className="font-mono text-[#C5A56A]">KalaMitra_Live_Demo.wav</span>
                <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-[10px]">
                  Online
                </span>
              </div>

              <div className="bg-black/30 p-4 rounded-xl border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-300 font-mono">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                  <span>Audio Waveform Capture</span>
                </div>
                <div className="flex items-center justify-between h-8 gap-1 px-1">
                  {[40, 75, 30, 90, 60, 100, 45, 80, 55, 95, 35, 70, 85, 50, 65, 40].map((h, i) => (
                    <div
                      key={i}
                      className="w-1.5 bg-[#C5A56A] rounded-full transition-all duration-300"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
                <div className="text-xs text-gray-200 italic pt-1">
                  &quot;This is a handmade Kasuti bag. The price is 800 rupees. It took me three days to make.&quot;
                </div>
              </div>

              <div className="bg-[#FAF7F0] text-[#272522] p-4 rounded-xl text-xs space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-[#B65F43] uppercase">
                  <span>Structured JSON Schema Output</span>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-medium">
                  <div>Product: <strong className="text-[#253451]">Kasuti Embroidery Bag</strong></div>
                  <div>Craft: <strong className="text-[#253451]">Kasuti Needlework</strong></div>
                  <div>Artisan Price: <strong className="text-[#B65F43]">₹800 INR</strong></div>
                  <div>Time to Make: <strong className="text-[#253451]">3 days</strong></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#E8E2D6] gap-4">
          <div>
            <div className="text-xs font-bold text-[#B65F43] uppercase tracking-wider mb-1">
              Handmade & Verified
            </div>
            <h2 className="font-serif text-3xl font-bold text-[#253451]">
              Featured Artisan Crafts
            </h2>
          </div>

          <Link
            href="/explore"
            className="text-xs font-semibold text-[#B65F43] hover:text-[#974931] flex items-center gap-1 transition-colors"
          >
            <span>View All Crafts</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Popular Craft Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="text-xs font-bold text-[#B65F43] uppercase tracking-wider mb-1">
            Centuries of Heritage
          </div>
          <h2 className="font-serif text-3xl font-bold text-[#253451]">
            Explore Regional Craft Traditions
          </h2>
          <p className="text-xs text-[#5C5853] mt-2">
            Every category represents protected GI tags, ancestral knowledge, and eco-friendly vegetable/mineral pigments.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((c, i) => (
            <Link
              key={i}
              href={`/explore?category=${encodeURIComponent(c.name)}`}
              className="group warm-card overflow-hidden block rounded-2xl transition-all hover:-translate-y-1"
            >
              <div className="relative h-48 overflow-hidden bg-gray-100">
                <img
                  src={c.image}
                  alt={c.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-3 left-3 text-white">
                  <span className="text-[10px] bg-[#C5A56A] text-[#253451] font-bold px-2 py-0.5 rounded-full mb-1 inline-block">
                    {c.count}
                  </span>
                  <h3 className="font-serif text-lg font-bold">{c.name}</h3>
                </div>
              </div>
              <div className="p-4 bg-white">
                <p className="text-xs text-[#5C5853] line-clamp-2">{c.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CreateConnect: Custom Commission Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF7F0] border-2 border-[#C5A56A] rounded-3xl p-8 sm:p-12 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B65F43] uppercase tracking-wider">
                <Palette className="w-4 h-4" />
                <span>CreateConnect • Bespoke Commissions</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#253451]">
                Commission What You Imagine Directly From Master Artisans
              </h2>

              <p className="text-sm text-[#5C5853] leading-relaxed max-w-2xl">
                Looking for a custom wedding sari with ancestral temple motifs, a bespoke quartz blue pottery
                dinner set, or handcrafted wooden furniture? Upload your reference image, specify your budget,
                and receive authentic proposals from verified makers.
              </p>

              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  href="/custom"
                  className="bg-[#253451] hover:bg-[#34486E] text-white px-6 py-3 rounded-xl text-xs font-semibold shadow-md flex items-center gap-2 transition-all"
                >
                  <Palette className="w-4 h-4 text-[#C5A56A]" />
                  <span>Start Custom Commission Request</span>
                </Link>

                <Link
                  href="/custom"
                  className="text-xs font-semibold text-[#253451] hover:text-[#B65F43] flex items-center gap-1 self-center"
                >
                  <span>Browse Active Requests</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-[#E8E2D6] shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#253451] uppercase">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Buyer & Artisan Escrow Trust</span>
              </div>
              <ul className="text-xs text-gray-600 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-[#B65F43] shrink-0 mt-0.5" />
                  <span>Artisans provide milestone photos before each dispatch</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-[#B65F43] shrink-0 mt-0.5" />
                  <span>Direct communication on measurements and natural colors</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-[#B65F43] shrink-0 mt-0.5" />
                  <span>Transparent cost structure with zero middleman markups</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Artisan Voices / Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="text-xs font-bold text-[#B65F43] uppercase tracking-wider mb-1">
            Artisan Voices
          </div>
          <h2 className="font-serif text-3xl font-bold text-[#253451]">
            Real Stories from the Loom & Wheel
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="warm-card p-6 rounded-2xl bg-white space-y-4">
            <Quote className="w-8 h-8 text-[#C5A56A]/60" />
            <p className="text-xs text-[#5C5853] italic leading-relaxed">
              &quot;I have been doing Kasuti embroidery for 18 years. Typing on English marketplace apps was impossible
              for me. With Kala Mitra, I spoke in my own language, and within two minutes my tote bag was listed with
              the right price.&quot;
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
                alt="Sunita Devi"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <div className="font-semibold text-xs text-[#253451]">Sunita Devi</div>
                <div className="text-[10px] text-gray-500">Master Kasuti Artisan • Dharwad</div>
              </div>
            </div>
          </div>

          <div className="warm-card p-6 rounded-2xl bg-white space-y-4">
            <Quote className="w-8 h-8 text-[#C5A56A]/60" />
            <p className="text-xs text-[#5C5853] italic leading-relaxed">
              &quot;The Digital Craft Passport is revolutionary. Customers in Mumbai and Bengaluru now see that our
              Blue Pottery uses real quartz powder and zero clay, and that our glazes are 100% lead-free. It protects our
              heritage.&quot;
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
                alt="Rameshwar Soni"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <div className="font-semibold text-xs text-[#253451]">Rameshwar Soni</div>
                <div className="text-[10px] text-gray-500">Blue Pottery Master • Jaipur</div>
              </div>
            </div>
          </div>

          <div className="warm-card p-6 rounded-2xl bg-white space-y-4">
            <Quote className="w-8 h-8 text-[#C5A56A]/60" />
            <p className="text-xs text-[#5C5853] italic leading-relaxed">
              &quot;Through CreateConnect, an architect commissioned 40 bespoke Channapatna wooden pendants for an eco-resort.
              We agreed on the design and fair price directly on the platform without agents taking 60% of our wages.&quot;
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
                alt="Manju Gowda"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <div className="font-semibold text-xs text-[#253451]">Manju Gowda</div>
                <div className="text-[10px] text-gray-500">Lacquer Toy Artisan • Channapatna</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Voice-to-Listing Modal Trigger */}
      <KalaMitraVoiceModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
        onConfirmListing={(details) => {
          window.location.href = `/artisan/create?prefill=${encodeURIComponent(JSON.stringify(details))}`;
        }}
      />
    </div>
  );
}
