'use client';

import React from 'react';
import Link from 'next/link';
import { CraftPassport } from '@/lib/types';
import {
  ShieldCheck,
  Award,
  Clock,
  Sparkles,
  ExternalLink,
  MapPin,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';

interface DigitalCraftPassportCardProps {
  passport?: CraftPassport | null;
  productId?: string;
  artisanName?: string;
}

export default function DigitalCraftPassportCard({
  passport,
  productId,
  artisanName,
}: DigitalCraftPassportCardProps) {
  if (!passport) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-dashed border-[#E8E2D6] text-gray-500 text-sm">
        <Award className="w-8 h-8 text-[#C5A56A] mx-auto mb-2 opacity-60" />
        <p className="font-semibold text-[#253451]">Digital Craft Passport Pending</p>
        <p className="text-xs text-gray-400 mt-1">This product is awaiting initial provenance registration.</p>
      </div>
    );
  }

  const isVerified = passport.provenanceStatus === 'independently-verified';
  const isCommunity = passport.provenanceStatus === 'community-reviewed';

  return (
    <div className="relative bg-[#FAF7F0] border-2 border-[#C5A56A] rounded-2xl p-6 sm:p-8 shadow-lg overflow-hidden">
      {/* Decorative Gold Heritage Emblem in top right */}
      <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-gradient-to-br from-[#E8D8B6]/30 to-[#C5A56A]/10 pointer-events-none blur-xl"></div>

      {/* Certificate Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8D8B6]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#253451] flex items-center justify-center text-[#C5A56A] shadow-md border border-[#C5A56A]/50">
            <Award className="w-6 h-6 text-[#C5A56A]" />
          </div>
          <div>
            <div className="text-[10px] font-bold tracking-widest text-[#B65F43] uppercase">
              Official Heritage Provenance
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#253451]">
              Digital Craft Passport
            </h3>
            <div className="text-xs font-mono text-gray-500 mt-0.5">
              Serial No: <span className="font-semibold text-[#253451]">{passport.passportNumber}</span>
            </div>
          </div>
        </div>

        {/* Provenance Tier Badge */}
        <div className="flex flex-col sm:items-end">
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
              isVerified
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                : isCommunity
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'bg-blue-50 text-blue-900 border border-blue-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="capitalize">{passport.provenanceStatus.replace('-', ' ')}</span>
          </div>
          <span className="text-[10px] text-gray-500 mt-1">
            {isVerified
              ? 'Independently audited & verified by Craft Guild'
              : isCommunity
              ? 'Reviewed by regional artisan community'
              : 'Directly declared by master maker'}
          </span>
        </div>
      </div>

      {/* Grid of Verified Passport Attributes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 text-sm">
        {/* Craft & Region */}
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-[#E8E2D6] shadow-sm">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
              Craft Tradition & GI Status
            </span>
            <div className="font-serif text-lg font-bold text-[#253451]">{passport.craftName}</div>
            <div className="flex items-center gap-1 text-xs text-[#B65F43] font-medium mt-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{passport.region}</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#E8E2D6] shadow-sm">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
              Certified Materials & Threads
            </span>
            <p className="text-xs text-gray-700 leading-relaxed font-medium">
              {passport.materials}
            </p>
          </div>
        </div>

        {/* Time, Effort & Technique */}
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-[#E8E2D6] shadow-sm">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
              Artisan Stated Time & Effort
            </span>
            <div className="flex items-center gap-2 text-[#253451] font-semibold">
              <Clock className="w-4 h-4 text-[#B65F43]" />
              <span>{passport.timeAndEffort}</span>
            </div>
            <p className="text-[11px] text-gray-500 mt-1">
              Every hour represents authentic handmade dedication with zero industrial mass fabrication.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#E8E2D6] shadow-sm">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
              Documented Heritage Technique
            </span>
            <p className="text-xs text-gray-700 leading-relaxed font-medium">
              {passport.techniques}
            </p>
          </div>
        </div>
      </div>

      {/* Cultural Story */}
      <div className="bg-white p-5 rounded-xl border border-[#E8E2D6] shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-[#253451] uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4 text-[#C5A56A]" />
          <span>Cultural Heritage Lineage & Story</span>
        </div>
        <p className="text-xs text-gray-700 leading-relaxed italic">
          &quot;{passport.culturalStory}&quot;
        </p>
      </div>

      {/* Audit & Verification Footer */}
      {passport.verificationDetails && (
        <div className="mt-6 pt-4 border-t border-[#E8D8B6] flex flex-wrap items-center justify-between text-xs text-gray-500 gap-2">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-emerald-600" />
            <span>
              Audit Authority:{' '}
              <strong className="text-gray-700">
                {passport.verificationDetails.verifiedBy || 'Regional Crafts Guild'}
              </strong>
            </span>
          </div>

          <Link
            href={`/passport/${passport.productId}`}
            className="text-[#B65F43] hover:underline flex items-center gap-1 font-semibold"
          >
            <span>View Public Certificate & QR</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
