'use client';

import React, { useState, useEffect, useRef } from 'react';
import { api } from '@/lib/api';
import { ExtractedProductDetails } from '@/lib/types';
import {
  Mic,
  MicOff,
  Sparkles,
  CheckCircle2,
  Edit3,
  RotateCcw,
  Volume2,
  AlertCircle,
  X,
  ArrowRight,
  Loader2,
} from 'lucide-react';

interface KalaMitraVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmListing: (details: ExtractedProductDetails) => void;
}

export default function KalaMitraVoiceModal({
  isOpen,
  onClose,
  onConfirmListing,
}: KalaMitraVoiceModalProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedProductDetails | null>(null);
  const [step, setStep] = useState<'speak' | 'review' | 'edit'>('speak');
  const [editableDetails, setEditableDetails] = useState<ExtractedProductDetails | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Web Speech API recognition ref
  const recognitionRef = useRef<any>(null);

  // Sample phrases for quick demonstration at competitions/hackathons
  const sampleSpeeches = [
    {
      title: 'Kasuti Silk Bag',
      text: 'This is a handmade Kasuti bag. The price is 800 rupees. It took me three days to make.',
      craft: 'Kasuti Embroidery',
    },
    {
      title: 'Jaipur Blue Pottery Vase',
      text: 'This is a traditional blue pottery vase with quartz and natural cobalt glaze. The price is 1800 rupees and takes seven days to make.',
      craft: 'Blue Pottery',
    },
    {
      title: 'Channapatna Wooden Toy',
      text: 'Handcrafted Channapatna toy rings made from seasoned wood and vegetable turmeric dyes. Price is 650 rupees, made in two days.',
      craft: 'Channapatna Lacquerware',
    },
  ];

  useEffect(() => {
    // Check if browser supports Web Speech API
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recog = new SpeechRecognition();
        recog.continuous = true;
        recog.interimResults = true;
        recog.lang = 'en-IN'; // Indian English accent tuning

        recog.onresult = (event: any) => {
          let current = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            current += event.results[i][0].transcript;
          }
          setTranscript(current);
        };

        recog.onerror = (e: any) => {
          console.warn('Speech recognition error:', e.error);
          setIsRecording(false);
        };

        recog.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recog;
      }
    }
  }, []);

  const startVoiceRecording = () => {
    setErrorMsg('');
    setTranscript('');
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch {
        // Recognition already started or permission issue
        setIsRecording(true);
      }
    } else {
      // Fallback message
      setErrorMsg('Browser microphone permission required or speech recognition not supported. You can click any sample speech below or type directly.');
    }
  };

  const stopVoiceRecording = async () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);

    if (transcript.trim()) {
      await processSpeech(transcript);
    }
  };

  const processSpeech = async (textToProcess: string) => {
    setIsProcessing(true);
    setErrorMsg('');
    try {
      const res = await api.extractVoiceListing(textToProcess);
      setExtractedData(res.extracted);
      setEditableDetails(res.extracted);
      setStep('review');
    } catch (err: any) {
      setErrorMsg('Extraction error: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplySample = async (speechText: string) => {
    setTranscript(speechText);
    await processSpeech(speechText);
  };

  const handleFinalConfirm = () => {
    if (editableDetails) {
      onConfirmListing(editableDetails);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#FAF7F0] border-2 border-[#C5A56A] rounded-2xl shadow-2xl overflow-hidden text-[#272522]">
        {/* Header */}
        <div className="bg-[#253451] text-[#FAF7F0] p-5 flex items-center justify-between border-b border-[#34486E]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#B65F43] flex items-center justify-center text-white shadow-md">
              <Mic className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-xl font-bold tracking-tight text-white">
                  Kala Mitra • Voice-to-Listing
                </h3>
                <span className="bg-[#C5A56A]/20 text-[#E8D8B6] border border-[#C5A56A]/40 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  AI Artisan Studio
                </span>
              </div>
              <p className="text-xs text-gray-300">
                Speak naturally in your words. Kala Mitra transforms your voice into a verified marketplace listing.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body content based on step */}
        <div className="p-6">
          {step === 'speak' && (
            <div className="space-y-6">
              {/* Mic Centerpiece */}
              <div className="text-center py-6">
                <div className="relative inline-block">
                  {isRecording && (
                    <div className="absolute inset-0 rounded-full bg-[#B65F43] opacity-30 animate-ping"></div>
                  )}
                  <button
                    onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                    className={`relative w-24 h-24 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-xl ${
                      isRecording
                        ? 'bg-[#B65F43] text-white scale-105 ring-4 ring-[#B65F43]/40'
                        : 'bg-[#253451] hover:bg-[#B65F43] text-[#FAF7F0] hover:scale-105'
                    }`}
                  >
                    {isRecording ? <MicOff className="w-9 h-9" /> : <Mic className="w-9 h-9" />}
                  </button>
                </div>

                <div className="mt-4">
                  <p className="font-serif text-lg font-semibold text-[#253451]">
                    {isRecording ? 'Listening... Speak your craft details' : 'Tap Microphone to Speak'}
                  </p>
                  <p className="text-xs text-[#5C5853] mt-1">
                    Mention your craft, item name, price, and how long it took to make.
                  </p>
                </div>
              </div>

              {/* Live Transcript / Speech Waveform */}
              {isRecording && (
                <div className="bg-white p-4 rounded-xl border border-[#B65F43] shadow-inner space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#B65F43]">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                      <span>Recording Live Voice...</span>
                    </div>
                    <button
                      onClick={stopVoiceRecording}
                      className="bg-[#B65F43] text-white px-3 py-1 rounded text-xs font-medium"
                    >
                      Done Speaking
                    </button>
                  </div>
                  <p className="text-sm italic text-gray-700 min-h-[3rem]">
                    {transcript || 'Say something like: "This is a handmade Kasuti bag, price is 800 rupees..."'}
                  </p>
                </div>
              )}

              {/* Manual Speech Text Input Fallback */}
              {!isRecording && (
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Or Type / Paste Speech Text Fallback:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={transcript}
                      onChange={(e) => setTranscript(e.target.value)}
                      placeholder='e.g., "This is a handmade Kasuti bag. The price is 800 rupees. It took me three days to make."'
                      className="flex-1 text-sm bg-white border border-[#E8E2D6] rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#B65F43]"
                    />
                    <button
                      onClick={() => processSpeech(transcript)}
                      disabled={!transcript.trim() || isProcessing}
                      className="bg-[#253451] hover:bg-[#B65F43] disabled:opacity-50 text-white px-4 py-2.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
                    >
                      {isProcessing ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4 text-[#C5A56A]" />
                      )}
                      <span>Extract</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Sample Phrases for Instant Demo Testing */}
              <div className="pt-3 border-t border-[#E8E2D6]">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Quick Demo Samples (Click to test AI parser):</span>
                  <span className="text-[10px] text-[#B65F43] font-medium">1-Click Test</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {sampleSpeeches.map((sample, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleApplySample(sample.text)}
                      className="text-left bg-white hover:bg-amber-50/70 border border-[#E8E2D6] hover:border-[#C5A56A] p-2.5 rounded-lg transition-all text-xs group"
                    >
                      <div className="font-semibold text-[#253451] group-hover:text-[#B65F43]">
                        {sample.title}
                      </div>
                      <div className="text-[10px] text-gray-500 line-clamp-2 mt-0.5">
                        &quot;{sample.text}&quot;
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {errorMsg && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>
          )}

          {/* Review Extracted Structured Details */}
          {step === 'review' && extractedData && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Friendly Clarification Notice */}
              <div className="bg-amber-50/80 border border-[#C5A56A] p-4 rounded-xl flex items-start gap-3">
                <Volume2 className="w-5 h-5 text-[#B65F43] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-[#B65F43] uppercase tracking-wider">
                    Kala Mitra Confirmation
                  </div>
                  <p className="text-sm font-medium text-[#253451] mt-0.5">
                    &quot;{extractedData.clarification}&quot;
                  </p>
                  <p className="text-[11px] text-gray-600 mt-1">
                    AI extracted with {(extractedData.confidenceScore * 100).toFixed(0)}% confidence.
                    You are in 100% control of all listed information.
                  </p>
                </div>
              </div>

              {/* Extracted Fields Summary Card */}
              <div className="bg-white rounded-xl border border-[#E8E2D6] p-5 shadow-sm space-y-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Structured Listing Fields
                  </div>
                  <button
                    onClick={() => setStep('edit')}
                    className="text-xs text-[#B65F43] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit details</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-gray-400 block mb-0.5">Product Title:</span>
                    <span className="font-semibold text-sm text-[#253451]">{editableDetails?.productName}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-0.5">Heritage Craft:</span>
                    <span className="font-semibold text-sm text-[#253451]">{editableDetails?.craftType}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-0.5">Artisan Selling Price:</span>
                    <span className="font-serif text-lg font-bold text-[#B65F43]">
                      ₹{editableDetails?.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-0.5">Time to Make:</span>
                    <span className="font-semibold text-sm text-[#253451]">{editableDetails?.timeToMake}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-400 block mb-0.5">Materials:</span>
                    <span className="text-gray-700">
                      {editableDetails?.materials || 'Traditional handcrafted materials'}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-400 block mb-0.5">Generated Description:</span>
                    <p className="text-gray-700 italic text-xs leading-relaxed">
                      &quot;{editableDetails?.description}&quot;
                    </p>
                  </div>
                </div>

                {extractedData.missingQuestions && extractedData.missingQuestions.length > 0 && (
                  <div className="mt-2 bg-blue-50/70 border border-blue-200 p-2.5 rounded-lg text-xs text-blue-800">
                    <span className="font-semibold block">Optional Enrichment:</span>
                    <span>{extractedData.missingQuestions[0]}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setStep('speak')}
                  className="flex items-center gap-1 text-xs text-gray-600 hover:text-black py-2 px-3 rounded-lg border border-gray-300 hover:bg-gray-50"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Start Again</span>
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => setStep('edit')}
                    className="flex items-center gap-1.5 text-xs text-[#253451] border border-[#253451] px-4 py-2.5 rounded-lg font-medium hover:bg-gray-100"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Correct Details</span>
                  </button>

                  <button
                    onClick={handleFinalConfirm}
                    className="flex items-center gap-2 bg-[#B65F43] hover:bg-[#974931] text-white px-5 py-2.5 rounded-lg text-xs font-semibold shadow-md transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Yes, Continue with these details</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Fields Form */}
          {step === 'edit' && editableDetails && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="text-xs text-gray-500 mb-2">
                Fine-tune any extracted field before finalizing the listing.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-gray-700 mb-1">Product Name</label>
                  <input
                    type="text"
                    value={editableDetails.productName}
                    onChange={(e) =>
                      setEditableDetails({ ...editableDetails, productName: e.target.value })
                    }
                    className="w-full bg-white border border-[#E8E2D6] rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Craft Type</label>
                  <input
                    type="text"
                    value={editableDetails.craftType}
                    onChange={(e) =>
                      setEditableDetails({ ...editableDetails, craftType: e.target.value })
                    }
                    className="w-full bg-white border border-[#E8E2D6] rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Selling Price (INR ₹)</label>
                  <input
                    type="number"
                    value={editableDetails.price}
                    onChange={(e) =>
                      setEditableDetails({ ...editableDetails, price: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full bg-white border border-[#E8E2D6] rounded-lg px-3 py-2 font-bold text-[#B65F43]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Time to Make</label>
                  <input
                    type="text"
                    value={editableDetails.timeToMake}
                    onChange={(e) =>
                      setEditableDetails({ ...editableDetails, timeToMake: e.target.value })
                    }
                    className="w-full bg-white border border-[#E8E2D6] rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={editableDetails.stockQuantity}
                    onChange={(e) =>
                      setEditableDetails({
                        ...editableDetails,
                        stockQuantity: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-full bg-white border border-[#E8E2D6] rounded-lg px-3 py-2"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-gray-700 mb-1">Materials Used</label>
                  <input
                    type="text"
                    value={editableDetails.materials || ''}
                    placeholder="e.g. Pure Silk, Vegetable dye, Teak wood"
                    onChange={(e) =>
                      setEditableDetails({ ...editableDetails, materials: e.target.value })
                    }
                    className="w-full bg-white border border-[#E8E2D6] rounded-lg px-3 py-2"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={editableDetails.description}
                    onChange={(e) =>
                      setEditableDetails({ ...editableDetails, description: e.target.value })
                    }
                    className="w-full bg-white border border-[#E8E2D6] rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
                <button
                  onClick={() => setStep('review')}
                  className="px-4 py-2 text-xs text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  Back to Review
                </button>
                <button
                  onClick={handleFinalConfirm}
                  className="px-5 py-2 text-xs bg-[#B65F43] hover:bg-[#974931] text-white font-semibold rounded-lg shadow"
                >
                  Confirm & Populate Listing
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
