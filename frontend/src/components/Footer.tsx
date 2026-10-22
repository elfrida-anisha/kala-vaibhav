'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Heart, Shield, Award, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#253451] text-[#FAF7F0] pt-16 pb-12 border-t-4 border-[#C5A56A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#FAF7F0] flex items-center justify-center text-[#253451]">
                <Sparkles className="w-5 h-5 text-[#B65F43]" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                Kala Vaibhav
              </span>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              Every Craft Has a Story. Every Artisan Deserves a Market. Empowering traditional Indian
              masters with voice-first selling, Digital Craft Passports, and bespoke design commissions.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#C5A56A] font-medium pt-2">
              <Award className="w-4 h-4" />
              <span>Recognizing GI-Certified Indian Craft Heritage</span>
            </div>
          </div>

          {/* Marketplace Navigation */}
          <div>
            <h4 className="font-serif text-base font-semibold text-[#E8D8B6] mb-4 tracking-wide uppercase text-xs">
              Marketplace
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-300">
              <li>
                <Link href="/explore" className="hover:text-[#C5A56A] transition-colors">
                  Explore Crafts
                </Link>
              </li>
              <li>
                <Link href="/explore?category=Textiles+%26+Embroidery" className="hover:text-[#C5A56A] transition-colors">
                  Kasuti & Handlooms
                </Link>
              </li>
              <li>
                <Link href="/explore?category=Pottery+%26+Ceramics" className="hover:text-[#C5A56A] transition-colors">
                  Jaipur Blue Pottery
                </Link>
              </li>
              <li>
                <Link href="/explore?category=Toys+%26+Living" className="hover:text-[#C5A56A] transition-colors">
                  Channapatna Wooden Toys
                </Link>
              </li>
              <li>
                <Link href="/custom" className="hover:text-[#C5A56A] transition-colors">
                  CreateConnect: Custom Commissions
                </Link>
              </li>
            </ul>
          </div>

          {/* Provenance & Artisan Care */}
          <div>
            <h4 className="font-serif text-base font-semibold text-[#E8D8B6] mb-4 tracking-wide uppercase text-xs">
              Artisan & Provenance
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-300">
              <li>
                <Link href="/artisan/create" className="hover:text-[#C5A56A] transition-colors flex items-center gap-1.5">
                  <span className="text-[#C5A56A]">●</span> Kala Mitra Voice-to-Listing
                </Link>
              </li>
              <li>
                <Link href="/stories" className="hover:text-[#C5A56A] transition-colors">
                  Craft Journeys & Storytelling
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#C5A56A] transition-colors">
                  Digital Craft Passport Protocol
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#C5A56A] transition-colors">
                  Fair Trade & Transparent Pricing
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-[#C5A56A] transition-colors">
                  Buyer Order & Milestone Tracking
                </Link>
              </li>
            </ul>
          </div>

          {/* Artisan Helpline & Assurance */}
          <div>
            <h4 className="font-serif text-base font-semibold text-[#E8D8B6] mb-4 tracking-wide uppercase text-xs">
              Artisan Support & Trust
            </h4>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#C5A56A] shrink-0 mt-0.5" />
                <span>Toll-free Artisan Voice Support: 1800-KALA-VAIBHAV (Demo)</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#C5A56A] shrink-0 mt-0.5" />
                <span>support@kalavaibhav.org</span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C5A56A] shrink-0 mt-0.5" />
                <span>Artisan Clusters: Dharwad, Jaipur, Channapatna, Raghurajpur</span>
              </div>
              <div className="bg-[#1C283F] p-3 rounded-lg border border-[#34486E] text-xs text-gray-300 mt-2">
                <div className="flex items-center gap-1.5 text-[#E8D8B6] font-semibold mb-1">
                  <Shield className="w-3.5 h-3.5 text-[#C5A56A]" />
                  <span>Fair Trade Guarantee</span>
                </div>
                <span>Every product price is 100% determined by the maker.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#34486E] pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-[#B65F43] fill-[#B65F43]" />
            <span>for Indian Artisans • Kala Vaibhav © 2026</span>
          </div>

          <div className="flex flex-wrap gap-5 text-gray-300">
            <Link href="/about" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/about" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/about" className="hover:text-white transition-colors">
              Refund & Cancellation
            </Link>
            <Link href="/admin" className="text-[#C5A56A] hover:underline">
              Curator Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
