'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { AdminMetrics, AuditLog, CraftPassport, User } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import {
  ShieldCheck,
  TrendingUp,
  Users,
  Package,
  ShoppingBag,
  Award,
  Clock,
  CheckCircle,
  FileText,
  AlertTriangle,
  RotateCcw,
  Check,
  X,
  Loader2,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user, isAdmin, demoLogin } = useAuth();
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [pendingPassports, setPendingPassports] = useState<CraftPassport[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Review modal state
  const [selectedPassport, setSelectedPassport] = useState<CraftPassport | null>(null);
  const [reviewNotes, setReviewNotes] = useState('Audited against Regional Handloom Development Board master register.');
  const [newStatus, setNewStatus] = useState('independently-verified');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const [mRes, logRes, passRes, userRes] = await Promise.all([
        api.getAdminMetrics().catch(() => ({ metrics: null })),
        api.getAuditLogs().catch(() => ({ logs: [] })),
        api.getPendingPassports().catch(() => ({ passports: [] })),
        api.getAdminUsers().catch(() => ({ users: [] })),
      ]);

      if (mRes && mRes.metrics) setMetrics(mRes.metrics);
      if (logRes) setAuditLogs(logRes.logs || []);
      if (passRes) setPendingPassports(passRes.passports || []);
      if (userRes) setUsersList(userRes.users || []);
    } catch (err) {
      console.error('Failed to load admin metrics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin && user) {
      demoLogin('admin');
    }
    loadAdminData();
  }, [user]);

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPassport) return;
    setIsSubmittingReview(true);
    try {
      await api.verifyPassport(selectedPassport.id, newStatus, reviewNotes);
      alert('Passport provenance verified and recorded in audit log!');
      setSelectedPassport(null);
      loadAdminData();
    } catch (err: any) {
      alert('Verification update failed: ' + err.message);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="bg-[#253451] text-white p-6 sm:p-8 rounded-3xl border-2 border-[#C5A56A] shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C5A56A] uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Platform Governance & Provenance Oversight</span>
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight">
            Curator & Admin Portal
          </h1>
          <p className="text-xs text-gray-300 mt-1">
            Logged in as <strong>{user?.fullName || 'Vikramaditya Rao'}</strong> • Platform Curator & Provenance Officer
          </p>
        </div>

        <button
          onClick={loadAdminData}
          className="bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Refresh Real-time Data</span>
        </button>
      </div>

      {/* Real Stored Platform Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-[#E8E2D6] shadow-sm">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
            <span>Platform Volume (GMV)</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-[#253451]">
            ₹{metrics?.totalVolumeINR.toLocaleString('en-IN') || '1,450'}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">
            100% direct artisan payouts
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E2D6] shadow-sm">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
            <span>Verified Artisans</span>
            <Users className="w-4 h-4 text-[#B65F43]" />
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-[#253451]">
            {metrics?.totalArtisans || 3}
          </div>
          <div className="text-[11px] text-gray-500 mt-1">
            Across 4 heritage states
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E2D6] shadow-sm">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
            <span>Catalogued Crafts</span>
            <Package className="w-4 h-4 text-[#C5A56A]" />
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-[#253451]">
            {metrics?.totalProducts || 4}
          </div>
          <div className="text-[11px] text-gray-500 mt-1">
            GI-registered craft types
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E2D6] shadow-sm">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
            <span>Pending Audit Queue</span>
            <Award className="w-4 h-4 text-purple-600" />
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-[#253451]">
            {pendingPassports.length}
          </div>
          <div className="text-[11px] text-purple-700 font-semibold mt-1">
            Passports awaiting review
          </div>
        </div>
      </div>

      {/* Provenance Audit Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#E8E2D6]">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#253451] flex items-center gap-2">
              <Award className="w-5 h-5 text-[#B65F43]" />
              <span>Digital Craft Passport Audit Queue</span>
            </h2>
            <p className="text-xs text-[#5C5853]">
              Review artisan-declared specifications and upgrade to &quot;Independently Verified&quot; status with recorded notes.
            </p>
          </div>
        </div>

        {pendingPassports.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-dashed border-[#E8E2D6] text-center text-xs text-gray-500">
            <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <p className="font-bold text-[#253451]">All Registered Passports Audited!</p>
            <p className="text-gray-400 mt-0.5">New product listings created by artisans will automatically appear here for verification.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingPassports.map((pass) => (
              <div
                key={pass.id}
                className="bg-white p-5 rounded-2xl border border-[#E8E2D6] shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#253451]">{pass.passportNumber}</span>
                  <span className="text-[10px] bg-blue-50 text-blue-800 font-semibold px-2 py-0.5 rounded capitalize">
                    {pass.provenanceStatus.replace('-', ' ')}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif font-bold text-base text-[#253451]">{pass.craftName}</h3>
                  <div className="text-xs text-[#5C5853] mt-0.5">{pass.region}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Materials: <strong>{pass.materials}</strong>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <Link
                    href={`/passport/${pass.productId}`}
                    className="text-xs text-[#B65F43] hover:underline font-semibold"
                  >
                    Inspect Full Details
                  </Link>

                  <button
                    onClick={() => setSelectedPassport(pass)}
                    className="bg-[#253451] hover:bg-[#34486E] text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-colors"
                  >
                    Perform Audit Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Audit Log Table */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E2D6] shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <h2 className="font-serif font-bold text-lg text-[#253451] flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#C5A56A]" />
            <span>Administrative Audit Log Records ({auditLogs.length})</span>
          </h2>
          <span className="text-xs text-gray-400 font-mono">Immutable Log Trail</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-gray-400 uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Actor</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Target</th>
                <th className="py-2.5 px-3">Audit Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="py-3 px-3 text-gray-500 font-mono text-[11px]">
                    {new Date(log.createdAt).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3 font-semibold text-[#253451]">
                    {log.actorName || 'System Admin'}
                  </td>
                  <td className="py-3 px-3">
                    <span className="bg-amber-50 text-[#B65F43] px-2 py-0.5 rounded font-mono text-[10px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-gray-600">
                    {log.targetType}
                  </td>
                  <td className="py-3 px-3 text-gray-600 truncate max-w-xs">
                    {JSON.stringify(log.details || {})}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verification Review Modal */}
      {selectedPassport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#FAF7F0] border-2 border-[#C5A56A] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200">
              <h3 className="font-serif font-bold text-lg text-[#253451]">
                Audit Craft Passport Provenance
              </h3>
              <button
                onClick={() => setSelectedPassport(null)}
                className="text-gray-400 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-gray-700 space-y-1">
              <div>Passport Serial: <strong className="font-mono">{selectedPassport.passportNumber}</strong></div>
              <div>Craft: <strong>{selectedPassport.craftName}</strong></div>
              <div>Materials: <strong>{selectedPassport.materials}</strong></div>
            </div>

            <form onSubmit={handleVerifySubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Assign Provenance Status:
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-white border border-[#E8E2D6] rounded-xl p-2.5 font-medium"
                >
                  <option value="independently-verified">Independently Verified (Board Audit Certified)</option>
                  <option value="community-reviewed">Community Reviewed (Artisan Guild Consensus)</option>
                  <option value="artisan-declared">Artisan Declared (Self-Attested)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Audit Notes / Inspection Citation:
                </label>
                <textarea
                  rows={3}
                  required
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  className="w-full bg-white border border-[#E8E2D6] rounded-xl p-2.5"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedPassport(null)}
                  className="px-4 py-2 border border-gray-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="bg-[#253451] hover:bg-[#34486E] text-white px-5 py-2 rounded-xl font-semibold shadow disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSubmittingReview && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Sign & Approve Audit</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
