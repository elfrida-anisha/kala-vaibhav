'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Product } from '@/lib/types';
import {
  MessageSquare,
  Sparkles,
  X,
  Send,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Compass,
  Loader2,
} from 'lucide-react';

interface ChatMessage {
  sender: 'user' | 'assistant';
  text: string;
  suggestions?: Product[];
}

export default function BuyerAssistantDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'assistant',
      text: 'Namaste! I am Kala Saathi, your AI heritage craft guide. Ask me about authentic Indian crafts, care tips, or how to commission a custom masterpiece.',
    },
  ]);

  const quickPrompts = [
    'Are Channapatna toys safe for toddlers?',
    'How does Kasuti counted needlework work?',
    'What makes Jaipur Blue Pottery clay-free?',
    'How do I commission a custom craft?',
  ];

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = { sender: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await api.askBuyerAssistant(textToSend);
      const assistantMsg: ChatMessage = {
        sender: 'assistant',
        text: res.response,
        suggestions: res.suggestions,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: 'I am temporarily having trouble reaching our craft knowledge base. You can explore all verified crafts directly in the Explore catalogue.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-[#253451] hover:bg-[#B65F43] text-white p-3.5 rounded-full shadow-2xl flex items-center gap-2.5 transition-all hover:scale-105 border-2 border-[#C5A56A]"
        aria-label="Ask Kala Saathi Craft Guide"
      >
        <Sparkles className="w-5 h-5 text-[#C5A56A]" />
        <span className="text-xs font-semibold pr-1 hidden sm:inline">Kala Saathi</span>
      </button>

      {/* Floating Chat Drawer */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm sm:max-w-md bg-[#FAF7F0] border-2 border-[#C5A56A] rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[520px] animate-in slide-in-from-bottom-5 text-[#272522]">
          {/* Header */}
          <div className="bg-[#253451] text-[#FAF7F0] p-4 flex items-center justify-between border-b border-[#34486E]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#B65F43] flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4 text-[#C5A56A]" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm text-white">Kala Saathi</h4>
                <div className="text-[10px] text-gray-300">AI Craft & Provenance Assistant</div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-300 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  m.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#253451] text-white rounded-tr-none'
                      : 'bg-white text-gray-800 border border-[#E8E2D6] rounded-tl-none shadow-sm'
                  }`}
                >
                  <p>{m.text}</p>
                </div>

                {/* Product Suggestions Attached to Assistant Answer */}
                {m.suggestions && m.suggestions.length > 0 && (
                  <div className="mt-2 space-y-1.5 w-full pl-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                      Recommended from Catalogue:
                    </span>
                    {m.suggestions.map((p) => (
                      <Link
                        key={p.id}
                        href={`/products/${p.id}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2.5 bg-white p-2 rounded-lg border border-[#E8E2D6] hover:border-[#B65F43] transition-colors shadow-xs"
                      >
                        <img
                          src={p.images?.[0]?.imageUrl}
                          alt={p.title}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-800 truncate">{p.title}</div>
                          <div className="text-[10px] text-[#B65F43] font-bold">
                            ₹{p.price.toLocaleString('en-IN')}
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-gray-400 text-xs italic">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#B65F43]" />
                <span>Kala Saathi is searching craft traditions...</span>
              </div>
            )}
          </div>

          {/* Quick Questions Pills */}
          <div className="px-3 py-2 bg-white/70 border-t border-[#E8E2D6] overflow-x-auto flex gap-1.5 scrollbar-none text-[10px]">
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="whitespace-nowrap bg-[#FAF7F0] hover:bg-amber-100/70 border border-[#E8E2D6] px-2.5 py-1 rounded-full text-gray-700 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-white border-t border-[#E8E2D6] flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask about Kasuti, Blue Pottery, customs..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(input)}
              className="flex-1 text-xs bg-[#FAF7F0] border border-[#E8E2D6] rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#B65F43]"
            />
            <button
              onClick={() => handleSendMessage(input)}
              disabled={!input.trim() || isLoading}
              className="bg-[#253451] hover:bg-[#B65F43] disabled:opacity-50 text-white p-2 rounded-xl transition-colors"
              aria-label="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
