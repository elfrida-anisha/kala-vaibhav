'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { CustomRequest, CommissionProposal } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import {
  Palette,
  Clock,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Send,
  ArrowRight,
  AlertCircle,
  Calendar,
  Lock,
  Loader2,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export default function CustomRequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { user, isArtisan, demoLogin } = useAuth();

  const [request, setRequest] = useState<CustomRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  // Milestone advance state for artisan
  const [advancingMilestone, setAdvancingMilestone] = useState(false);

  const loadData = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const res = await api.getCustomRequest(id);
      setRequest(res.request);
    } catch (err: any) {
      console.error('Failed to load custom request:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleAcceptProposal = async (proposalId: string) => {
    if (!confirm('Accept this artisan proposal and proceed to milestone production?')) return;
    setAcceptingId(proposalId);
    try {
      await api.acceptProposal(id, proposalId);
      alert('Proposal accepted! The artisan has been notified to begin creation.');
      loadData();
    } catch (err: any) {
      alert('Error accepting proposal: ' + err.message);
    } finally {
      setAcceptingId(null);
    }
  };

  const handleAdvanceMilestone = async (nextStatus: string) => {
    setAdvancingMilestone(true);
    try {
      await api.updateMilestone(id, nextStatus);
      alert(`Milestone updated to: ${nextStatus.replace('_', ' ')}`);
      loadData();
    } catch (err: any) {
      alert('Failed to update milestone: ' + err.message);
    } finally {
      setAdvancingMilestone(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#B65F43]" />
        <p className="text-xs text-gray-500 font-medium">Loading bespoke commission...</p>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-gray-300 mx-auto" />
        <h2 className="font-serif text-2xl font-bold text-[#253451]">Request Not Found</h2>
        <Link href="/custom" className="text-xs text-[#B65F43] font-semibold hover:underline">
          Return to Custom Commissions
        </Link>
      </div>
    );
  }

  const isOwner = user?.id === request.buyerId;

  const milestones = [
    { key: 'submitted', label: 'Submitted' },
    { key: 'proposal_received', label: 'Proposal Received' },
    { key: 'accepted', label: 'Proposal Accepted' },
    { key: 'in_production', label: 'In Production' },
    { key: 'ready_to_ship', label: 'Ready to Ship' },
    { key: 'shipped', label: 'Shipped' },
    { key: 'delivered', label: 'Delivered' },
  ];

  const currentMilestoneIndex = milestones.findIndex((m) => m.key === request.status);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Link href="/" className="hover:text-gray-700">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/custom" className="hover:text-gray-700">Custom Commissions</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#253451] font-medium truncate max-w-xs">{request.title}</span>
      </div>

      {/* Main Request Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E2D6] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-[#FAF7F0] text-[#B65F43] border border-[#C5A56A]/50 font-bold px-3 py-1 rounded-full text-xs uppercase">
                {request.craftType}
              </span>
              <span className="text-xs text-gray-500 font-medium">
                Client: <strong>{request.buyerName || 'Client'}</strong>
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#253451]">
              {request.title}
            </h1>
          </div>

          <div className="sm:text-right bg-[#FAF7F0] p-4 rounded-2xl border border-[#E8E2D6]">
            <div className="text-[10px] text-gray-400 uppercase font-semibold">Budget Range</div>
            <div className="font-serif text-2xl font-bold text-[#253451]">
              ₹{request.budgetMin.toLocaleString('en-IN')} - ₹{request.budgetMax.toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-[#B65F43] font-medium mt-0.5">
              Due: {request.desiredDate || 'Flexible'}
            </div>
          </div>
        </div>

        {/* Milestone Stepper */}
        <div className="pt-4 border-t border-gray-100 space-y-3">
          <div className="text-xs font-bold text-[#253451] uppercase tracking-wider">
            Production & Delivery Milestones:
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs">
            {milestones.map((m, idx) => {
              const isPastOrCurrent = currentMilestoneIndex >= idx;
              const isCurrent = currentMilestoneIndex === idx;

              return (
                <div
                  key={m.key}
                  className={`p-2.5 rounded-xl border transition-all ${
                    isCurrent
                      ? 'bg-[#B65F43] text-white border-[#B65F43] font-bold shadow-sm'
                      : isPastOrCurrent
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-300 font-medium'
                      : 'bg-gray-50 text-gray-400 border-gray-200'
                  }`}
                >
                  <div className="text-[10px] uppercase block opacity-80">Step {idx + 1}</div>
                  <div className="truncate mt-0.5">{m.label}</div>
                </div>
              );
            })}
          </div>

          {/* Artisan Milestone Controls */}
          {isArtisan && request.status !== 'delivered' && (
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center justify-between text-xs">
              <span className="font-semibold text-gray-700">Artisan Production Action:</span>
              <div className="flex gap-2">
                {request.status === 'accepted' && (
                  <button
                    onClick={() => handleAdvanceMilestone('in_production')}
                    className="bg-[#253451] text-white px-3 py-1.5 rounded-lg text-xs font-medium"
                  >
                    Mark &quot;In Production&quot;
                  </button>
                )}
                {request.status === 'in_production' && (
                  <button
                    onClick={() => handleAdvanceMilestone('ready_to_ship')}
                    className="bg-[#253451] text-white px-3 py-1.5 rounded-lg text-xs font-medium"
                  >
                    Mark &quot;Ready to Ship&quot;
                  </button>
                )}
                {request.status === 'ready_to_ship' && (
                  <button
                    onClick={() => handleAdvanceMilestone('shipped')}
                    className="bg-[#253451] text-white px-3 py-1.5 rounded-lg text-xs font-medium"
                  >
                    Mark &quot;Shipped&quot;
                  </button>
                )}
                {request.status === 'shipped' && (
                  <button
                    onClick={() => handleAdvanceMilestone('delivered')}
                    className="bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium"
                  >
                    Mark &quot;Delivered&quot;
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Specifications & Reference Image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100 text-xs">
          <div className="space-y-3">
            <div>
              <span className="font-bold text-gray-400 uppercase tracking-wider block mb-1">
                Design Specifications:
              </span>
              <p className="text-sm text-gray-700 leading-relaxed font-medium">
                {request.description}
              </p>
            </div>

            {request.preferences && (
              <div className="bg-[#FAF7F0] p-4 rounded-xl border border-[#E8E2D6] space-y-1 text-gray-700">
                <span className="font-bold text-[#253451] block mb-1">Custom Preferences:</span>
                {Object.entries(request.preferences).map(([k, v]: [string, any]) => (
                  <div key={k} className="flex justify-between">
                    <span className="capitalize">{k}:</span>
                    <strong className="text-gray-900">{Array.isArray(v) ? v.join(', ') : String(v)}</strong>
                  </div>
                ))}
              </div>
            )}
          </div>

          {request.referenceImageUrl && (
            <div>
              <span className="font-bold text-gray-400 uppercase tracking-wider block mb-1">
                Buyer Reference / Inspiration Photo:
              </span>
              <div className="h-56 rounded-2xl overflow-hidden bg-gray-100 border border-[#E8E2D6]">
                <img
                  src={request.referenceImageUrl}
                  alt="Reference"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Proposals Received Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D6]">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#253451] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#C5A56A]" />
              <span>Proposals from Master Artisans ({request.proposals?.length || 0})</span>
            </h2>
            <p className="text-xs text-[#5C5853] mt-0.5">
              Compare craftsman quotations, estimated timelines, and authentic workshop notes.
            </p>
          </div>
        </div>

        {!request.proposals || request.proposals.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-[#E8E2D6] p-6 text-gray-500 text-xs">
            No artisan proposals submitted yet. Artisans are currently reviewing your custom requirements.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {request.proposals.map((prop) => {
              const isAccepted = prop.status === 'accepted';

              return (
                <div
                  key={prop.id}
                  className={`bg-white rounded-3xl p-6 sm:p-8 border-2 transition-all shadow-sm ${
                    isAccepted
                      ? 'border-emerald-500 bg-emerald-50/20 shadow-md'
                      : 'border-[#E8E2D6] hover:border-[#C5A56A]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                      <img
                        src={prop.artisanAvatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'}
                        alt={prop.artisanName}
                        className="w-14 h-14 rounded-full object-cover border-2 border-[#C5A56A]"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-serif font-bold text-lg text-[#253451]">
                            {prop.artisanName}
                          </h3>
                          <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-200">
                            Verified Maker
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Estimated Making Time: <strong>{prop.estimatedDays} days</strong>
                        </div>
                      </div>
                    </div>

                    <div className="sm:text-right">
                      <span className="text-[10px] text-gray-400 uppercase font-semibold">Artisan Quotation</span>
                      <div className="font-serif text-3xl font-bold text-[#B65F43]">
                        ₹{prop.proposedPrice.toLocaleString('en-IN')}
                      </div>
                      <span className="text-[10px] text-gray-500">100% fair trade direct wage</span>
                    </div>
                  </div>

                  {/* Proposal Message */}
                  <div className="py-4 text-xs text-gray-700 leading-relaxed italic">
                    &quot;{prop.message}&quot;
                  </div>

                  {/* Action Bar */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-semibold">
                      {isAccepted ? (
                        <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Accepted Proposal</span>
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">Status: Pending selection</span>
                      )}
                    </div>

                    {isOwner && request.status !== 'accepted' && request.status !== 'in_production' && (
                      <button
                        onClick={() => handleAcceptProposal(prop.id)}
                        disabled={acceptingId === prop.id}
                        className="bg-[#B65F43] hover:bg-[#974931] text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow flex items-center gap-2 transition-all hover:scale-102"
                      >
                        {acceptingId === prop.id && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        <span>Accept Proposal & Start Commission</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
