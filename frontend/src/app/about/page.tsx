'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Award,
  Mic,
  ShieldCheck,
  Palette,
  Heart,
  BookOpen,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 text-[#272522]">
      {/* Hero */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B65F43] uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-[#C5A56A]" />
          <span>Product Vision & Heritage Mission</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#253451] tracking-tight">
          About Kala Vaibhav
        </h1>
        <p className="font-serif text-xl sm:text-2xl text-[#B65F43] italic">
          &quot;Speak to sell. Buy what exists. Commission what you imagine. Discover the story behind every craft.&quot;
        </p>
        <p className="text-sm text-[#5C5853] leading-relaxed pt-2">
          India is home to over 7 million traditional artisans practicing generational craft forms like Kasuti
          embroidery, Jaipur Blue Pottery, Channapatna woodwork, and Bastar Dhokra. Yet, language barriers, complex
          digital forms, and exploitative intermediaries prevent them from claiming fair value for their mastery.
          Kala Vaibhav bridges this gap through voice-first AI and transparent provenance.
        </p>
      </div>

      {/* The 5 Architectural Innovations */}
      <div className="space-y-6">
        <div className="text-center pb-2">
          <h2 className="font-serif text-2xl font-bold text-[#253451]">
            Our Core Architectural Innovations
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Engineered for genuine digital inclusivity and trustworthy craft commerce.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E2D6] shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#B65F43] flex items-center justify-center">
              <Mic className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#253451]">
              1. Kala Mitra: Voice-to-Listing
            </h3>
            <p className="text-xs text-[#5C5853] leading-relaxed">
              Eliminates the digital divide. Artisans simply speak their item name, price, and days worked in their
              natural speech. Kala Mitra uses strict JSON schemas to extract fields and presents a voice confirmation
              card before publication.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E2D6] shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#253451] flex items-center justify-center">
              <Award className="w-6 h-6 text-[#C5A56A]" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#253451]">
              2. Digital Craft Passport
            </h3>
            <p className="text-xs text-[#5C5853] leading-relaxed">
              Every handcrafted piece receives a cryptographically logged provenance certificate recording certified
              materials, hours of handwork, GI tag affiliation, and independent guild verification status.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E2D6] shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#253451] flex items-center justify-center">
              <Palette className="w-6 h-6 text-[#B65F43]" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#253451]">
              3. CreateConnect: Bespoke Commissions
            </h3>
            <p className="text-xs text-[#5C5853] leading-relaxed">
              Buyers upload reference photos and custom dimensions, receiving direct quotations from certified
              artisans. Milestones are tracked from raw material selection to kiln firing and final delivery.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E2D6] shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#253451]">
              4. Transparent Fair-Trade Pricing
            </h3>
            <p className="text-xs text-[#5C5853] leading-relaxed">
              Artisans calculate fair dignified wages with our transparent pricing assistant. Buyers can view optional
              cost breakdowns explaining why authentic craftsmanship costs ₹X, with zero middleman commissions.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Actions */}
      <div className="bg-[#253451] text-white p-8 sm:p-12 rounded-3xl border-2 border-[#C5A56A] text-center space-y-6">
        <h2 className="font-serif text-3xl font-bold tracking-tight">
          Join the Heritage Craft Revival
        </h2>
        <p className="text-sm text-gray-300 max-w-xl mx-auto leading-relaxed">
          Whether you are an artisan seeking direct buyers, or a connoisseur wanting authentic heritage heirlooms,
          Kala Vaibhav is built for you.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/explore"
            className="bg-[#B65F43] hover:bg-[#974931] text-white px-6 py-3 rounded-xl text-xs font-bold transition-all shadow"
          >
            Explore Masterpieces
          </Link>
          <Link
            href="/artisan/create"
            className="bg-white text-[#253451] hover:bg-gray-100 px-6 py-3 rounded-xl text-xs font-bold transition-all shadow"
          >
            Sell with Kala Mitra
          </Link>
        </div>
      </div>
    </div>
  );
}
