'use client';

import React, { useState } from 'react';
import { api } from '@/lib/api';
import { PricingBreakdown } from '@/lib/types';
import {
  Calculator,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  X,
  TrendingUp,
  Shield,
  Loader2,
} from 'lucide-react';

interface PricingAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  craftType: string;
  initialPrice?: number;
  onApplyPrice: (price: number) => void;
}

export default function PricingAssistantModal({
  isOpen,
  onClose,
  craftType,
  initialPrice,
  onApplyPrice,
}: PricingAssistantModalProps) {
  const [materialCost, setMaterialCost] = useState(350);
  const [labourHours, setLabourHours] = useState(12);
  const [hourlyRate, setHourlyRate] = useState(120);
  const [overheadsCost, setOverheadsCost] = useState(100);
  const [packagingCost, setPackagingCost] = useState(60);
  const [complexityTier, setComplexityTier] = useState('moderate');
  const [isCalculating, setIsCalculating] = useState(false);
  const [pricingResult, setPricingResult] = useState<PricingBreakdown | null>(null);

  const calculateGuidance = async () => {
    setIsCalculating(true);
    try {
      const res = await api.getPricingGuidance({
        craftType,
        materialCost,
        labourHours,
        hourlyRate,
        overheadsCost,
        packagingCost,
        complexityTier,
      });
      setPricingResult(res.pricing);
    } catch (err: any) {
      alert('Pricing calculation error: ' + err.message);
    } finally {
      setIsCalculating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-[#FAF7F0] border-2 border-[#C5A56A] rounded-2xl shadow-2xl overflow-hidden text-[#272522]">
        {/* Header */}
        <div className="bg-[#253451] text-[#FAF7F0] p-5 flex items-center justify-between border-b border-[#34486E]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C5A56A] flex items-center justify-center text-[#253451] shadow-md">
              <Calculator className="w-5 h-5 font-bold" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <span>Transparent Pricing Assistance</span>
                <span className="text-[10px] bg-[#B65F43] text-white px-2 py-0.5 rounded font-sans uppercase">
                  Fair Trade
                </span>
              </h3>
              <p className="text-xs text-gray-300">
                Ensure dignified livelihood for your time, skill, and heritage materials.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Inputs Section */}
          <div className="bg-white p-5 rounded-xl border border-[#E8E2D6] shadow-sm space-y-4">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Artisan Cost Breakdown Inputs
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Raw Material Cost (₹)
                </label>
                <input
                  type="number"
                  value={materialCost}
                  onChange={(e) => setMaterialCost(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#FAF7F0] border border-[#E8E2D6] rounded-lg p-2.5 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Labour Time (Total Hours)
                </label>
                <input
                  type="number"
                  value={labourHours}
                  onChange={(e) => setLabourHours(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#FAF7F0] border border-[#E8E2D6] rounded-lg p-2.5 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Artisan Hourly Wage (₹/hr)
                </label>
                <input
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#FAF7F0] border border-[#E8E2D6] rounded-lg p-2.5 font-medium"
                />
                <span className="text-[10px] text-gray-400">Recommended dignified rate: ₹100–₹180/hr</span>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Workshop Overheads / Firing (₹)
                </label>
                <input
                  type="number"
                  value={overheadsCost}
                  onChange={(e) => setOverheadsCost(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#FAF7F0] border border-[#E8E2D6] rounded-lg p-2.5 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Eco-friendly Packaging (₹)
                </label>
                <input
                  type="number"
                  value={packagingCost}
                  onChange={(e) => setPackagingCost(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#FAF7F0] border border-[#E8E2D6] rounded-lg p-2.5 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Complexity & Lineage Tier
                </label>
                <select
                  value={complexityTier}
                  onChange={(e) => setComplexityTier(e.target.value)}
                  className="w-full bg-[#FAF7F0] border border-[#E8E2D6] rounded-lg p-2.5 font-medium"
                >
                  <option value="simple">Standard Craftwork (20% margin)</option>
                  <option value="moderate">Detailed Heritage Work (30% margin)</option>
                  <option value="masterpiece">Museum / Master Heirloom (40% margin)</option>
                </select>
              </div>
            </div>

            <button
              onClick={calculateGuidance}
              disabled={isCalculating}
              className="w-full bg-[#253451] hover:bg-[#B65F43] text-white py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow transition-all"
            >
              {isCalculating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 text-[#C5A56A]" />
              )}
              <span>Calculate Fair Trade Pricing</span>
            </button>
          </div>

          {/* Result Breakdown Card */}
          {pricingResult && (
            <div className="bg-white p-5 rounded-xl border border-[#C5A56A] shadow-md space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="text-xs font-bold text-[#B65F43] uppercase tracking-wider">
                  Fair Trade Price Guidance
                </span>
                <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-medium">
                  Guaranteed Artisan Control
                </span>
              </div>

              {/* Price Tiers */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <span className="text-[10px] text-gray-500 uppercase font-semibold block">Minimum Floor</span>
                  <span className="font-serif text-lg font-bold text-gray-700">
                    ₹{pricingResult.recommendedMinPrice.toFixed(0)}
                  </span>
                  <span className="text-[9px] text-gray-400 block mt-0.5">Covers core cost</span>
                </div>

                <div className="bg-amber-50/80 p-3 rounded-lg border-2 border-[#C5A56A]">
                  <span className="text-[10px] text-[#B65F43] uppercase font-bold block">Recommended Fair</span>
                  <span className="font-serif text-xl font-bold text-[#253451]">
                    ₹{pricingResult.recommendedFairPrice.toFixed(0)}
                  </span>
                  <span className="text-[9px] text-[#B65F43] font-semibold block mt-0.5">Dignified wage</span>
                </div>

                <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                  <span className="text-[10px] text-purple-700 uppercase font-semibold block">Premium / Heirloom</span>
                  <span className="font-serif text-lg font-bold text-purple-900">
                    ₹{pricingResult.recommendedMaxPrice.toFixed(0)}
                  </span>
                  <span className="text-[9px] text-purple-600 block mt-0.5">Collector grade</span>
                </div>
              </div>

              {/* Cost Summary Breakdown */}
              <div className="bg-[#FAF7F0] p-3 rounded-lg text-xs space-y-1 text-gray-600">
                <div className="flex justify-between">
                  <span>Materials & Raw Inputs:</span>
                  <span className="font-semibold text-gray-800">₹{pricingResult.materialCost}</span>
                </div>
                <div className="flex justify-between">
                  <span>Artisan Skilled Labour ({labourHours} hrs × ₹{hourlyRate}/hr):</span>
                  <span className="font-semibold text-gray-800">₹{pricingResult.labourCost}</span>
                </div>
                <div className="flex justify-between">
                  <span>Overheads & Packaging:</span>
                  <span className="font-semibold text-gray-800">
                    ₹{pricingResult.overheadsCost + pricingResult.packagingCost}
                  </span>
                </div>
                <div className="flex justify-between text-[#B65F43] font-bold pt-1 border-t border-[#E8E2D6]">
                  <span>Fair Artisan Profit Margin:</span>
                  <span>+₹{pricingResult.fairArtisanMargin.toFixed(0)}</span>
                </div>
              </div>

              <p className="text-xs text-gray-600 italic">
                &quot;{pricingResult.guidanceNotes}&quot;
              </p>

              {/* Apply Button */}
              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-xs border border-gray-300 rounded-lg"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    onApplyPrice(Math.round(pricingResult.recommendedFairPrice));
                    onClose();
                  }}
                  className="flex items-center gap-2 bg-[#B65F43] hover:bg-[#974931] text-white px-5 py-2 rounded-lg text-xs font-semibold shadow"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Apply ₹{Math.round(pricingResult.recommendedFairPrice)} to Listing</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
