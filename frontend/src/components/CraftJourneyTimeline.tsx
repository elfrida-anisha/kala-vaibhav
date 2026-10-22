'use client';

import React, { useState } from 'react';
import { CraftJourneyItem } from '@/lib/types';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import {
  Calendar,
  Plus,
  Image as ImageIcon,
  CheckCircle,
  Clock,
  Sparkles,
  Camera,
  Play,
  Loader2,
} from 'lucide-react';

interface CraftJourneyTimelineProps {
  productId: string;
  artisanId?: string;
  initialItems?: CraftJourneyItem[];
}

export default function CraftJourneyTimeline({
  productId,
  artisanId,
  initialItems = [],
}: CraftJourneyTimelineProps) {
  const { user } = useAuth();
  const [items, setItems] = useState<CraftJourneyItem[]>(initialItems);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New item form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [milestoneDate, setMilestoneDate] = useState(new Date().toISOString().split('T')[0]);

  const isOwner = user?.id === artisanId;

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !mediaUrl) return;

    setIsSubmitting(true);
    try {
      const res = await api.addJourneyItem({
        productId,
        title,
        description,
        mediaUrl,
        mediaType: 'image',
        stepOrder: items.length + 1,
        milestoneDate,
      });
      setItems([...items, res.item]);
      setTitle('');
      setDescription('');
      setMediaUrl('');
      setShowAddForm(false);
    } catch (err: any) {
      alert('Failed to add milestone: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header with Artisan Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E2D6]">
        <div>
          <h3 className="font-serif text-2xl font-bold text-[#253451] flex items-center gap-2">
            <span>Craft Journey: The Making Story</span>
            <Sparkles className="w-5 h-5 text-[#C5A56A]" />
          </h3>
          <p className="text-xs text-[#5C5853] mt-1">
            Follow the chronological steps of transformation from raw material to finished heirloom.
          </p>
        </div>

        {isOwner && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 bg-[#B65F43] hover:bg-[#974931] text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Making Milestone</span>
          </button>
        )}
      </div>

      {/* Add Milestone Form for Artisan */}
      {showAddForm && (
        <form
          onSubmit={handleAddItem}
          className="bg-white p-6 rounded-xl border border-[#C5A56A] shadow-md space-y-4 animate-in fade-in"
        >
          <div className="font-serif font-bold text-[#253451] text-base">
            Post Work-in-Progress Milestone
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Step Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Firing in traditional wood kiln"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#FAF7F0] border border-[#E8E2D6] rounded-lg p-2.5"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={milestoneDate}
                onChange={(e) => setMilestoneDate(e.target.value)}
                className="w-full bg-[#FAF7F0] border border-[#E8E2D6] rounded-lg p-2.5"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-gray-700 mb-1">Photo / Video URL</label>
              <input
                type="url"
                required
                placeholder="https://..."
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                className="w-full bg-[#FAF7F0] border border-[#E8E2D6] rounded-lg p-2.5"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-gray-700 mb-1">Technique Description</label>
              <textarea
                rows={3}
                placeholder="Explain the hand technique, hours spent, or special care taken..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#FAF7F0] border border-[#E8E2D6] rounded-lg p-2.5"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-xs border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs bg-[#B65F43] text-white font-semibold rounded-lg shadow disabled:opacity-50 flex items-center gap-1.5"
            >
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Save Milestone</span>
            </button>
          </div>
        </form>
      )}

      {/* Timeline Steps */}
      {items.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-[#E8E2D6] text-gray-500">
          <Camera className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <p className="font-semibold text-sm text-[#253451]">No Craft Journey Milestones Yet</p>
          <p className="text-xs text-gray-400 mt-1">The artisan will document work-in-progress photos during creation.</p>
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-8 border-l-2 border-[#C5A56A]/50 space-y-10">
          {items.map((step, idx) => (
            <div key={step.id || idx} className="relative group">
              {/* Timeline Pin Indicator */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-7 h-7 rounded-full bg-[#253451] border-2 border-[#C5A56A] flex items-center justify-center text-xs font-bold text-white shadow-md">
                {step.stepOrder || idx + 1}
              </div>

              {/* Card Container */}
              <div className="bg-white rounded-xl border border-[#E8E2D6] overflow-hidden shadow-sm group-hover:border-[#C5A56A] transition-all">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
                  {/* Photo/Media Frame */}
                  <div className="md:col-span-5 relative h-56 md:h-auto min-h-[200px] bg-gray-100 overflow-hidden">
                    <img
                      src={step.mediaUrl}
                      alt={step.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {step.mediaType === 'video' && (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/90 text-[#253451] flex items-center justify-center shadow-lg">
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content Area */}
                  <div className="md:col-span-7 p-6 flex flex-col justify-between">
                    <div>
                      {/* Step Header */}
                      <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                        <span className="font-bold text-[#B65F43] tracking-wider uppercase text-[10px]">
                          Phase {step.stepOrder || idx + 1}
                        </span>
                        {step.milestoneDate && (
                          <div className="flex items-center gap-1 text-[11px] text-gray-500 font-medium">
                            <Calendar className="w-3.5 h-3.5 text-[#C5A56A]" />
                            <span>{new Date(step.milestoneDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          </div>
                        )}
                      </div>

                      <h4 className="font-serif text-lg font-bold text-[#253451] mb-2">
                        {step.title}
                      </h4>

                      <p className="text-xs text-[#5C5853] leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2 text-[11px] text-[#253451] font-medium">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Artisan Authenticated Milestone</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
