'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import {
  ShoppingBag,
  Mic,
  Palette,
  ShieldCheck,
  User as UserIcon,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  LogOut,
  Compass,
  BookOpen,
  Info,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, isArtisan, isAdmin, demoLogin, logout } = useAuth();
  const { totalCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Explore Crafts', href: '/explore', icon: Compass },
    { name: 'Custom Design', href: '/custom', icon: Palette },
    { name: 'Craft Stories', href: '/stories', icon: BookOpen },
    { name: 'About', href: '/about', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F0]/95 backdrop-blur-md border-b border-[#E8E2D6] transition-all">
      {/* Top Banner: Demo Mode Indicator & Quick Switcher for Hackathon Evaluation */}
      <div className="bg-[#253451] text-[#FAF7F0] text-xs px-4 py-1.5 flex flex-wrap items-center justify-between border-b border-[#34486E]">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#C5A56A] animate-pulse"></span>
          <span className="font-medium tracking-wide">KALA VAIBHAV DEMO MODE</span>
          <span className="text-[#C5A56A] hidden sm:inline">•</span>
          <span className="text-gray-300 hidden sm:inline">Active Persona:</span>
          <span className="font-semibold text-[#E8D8B6]">
            {user ? `${user.fullName} (${user.role.toUpperCase()})` : 'Guest'}
          </span>
        </div>

        {/* 1-Click Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setDemoMenuOpen(!demoMenuOpen)}
            className="flex items-center gap-1.5 text-xs bg-[#34486E] hover:bg-[#B65F43] transition-colors text-white px-2.5 py-0.5 rounded-full font-medium"
            title="Switch demo persona for testing"
          >
            <span>Switch Persona</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {demoMenuOpen && (
            <div className="absolute right-0 mt-1 w-64 bg-white text-[#272522] rounded-lg shadow-xl border border-[#E8E2D6] py-1 z-50 text-xs">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-gray-400 border-b border-gray-100 uppercase tracking-wider">
                Select Demo Role
              </div>
              <button
                onClick={() => {
                  demoLogin('artisan', '11111111-1111-1111-1111-111111111111');
                  setDemoMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 hover:bg-[#FAF7F0] flex items-center justify-between"
              >
                <div>
                  <div className="font-medium text-[#253451]">Sunita Devi</div>
                  <div className="text-[10px] text-gray-500">Master Kasuti Artisan (Dharwad)</div>
                </div>
                <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-medium">Artisan</span>
              </button>
              <button
                onClick={() => {
                  demoLogin('artisan', '22222222-2222-2222-2222-222222222222');
                  setDemoMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 hover:bg-[#FAF7F0] flex items-center justify-between"
              >
                <div>
                  <div className="font-medium text-[#253451]">Rameshwar Soni</div>
                  <div className="text-[10px] text-gray-500">Blue Pottery Master (Jaipur)</div>
                </div>
                <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-medium">Artisan</span>
              </button>
              <button
                onClick={() => {
                  demoLogin('buyer', '44444444-4444-4444-4444-444444444444');
                  setDemoMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 hover:bg-[#FAF7F0] flex items-center justify-between border-t border-gray-100"
              >
                <div>
                  <div className="font-medium text-[#253451]">Anamika Sharma</div>
                  <div className="text-[10px] text-gray-500">Craft Connoisseur & Buyer</div>
                </div>
                <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-medium">Buyer</span>
              </button>
              <button
                onClick={() => {
                  demoLogin('admin', '55555555-5555-5555-5555-555555555555');
                  setDemoMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 hover:bg-[#FAF7F0] flex items-center justify-between border-t border-gray-100"
              >
                <div>
                  <div className="font-medium text-[#253451]">Vikramaditya Rao</div>
                  <div className="text-[10px] text-gray-500">Platform Curator & Admin</div>
                </div>
                <span className="text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded font-medium">Admin</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Wordmark & Emblem */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-[#253451] flex items-center justify-center text-[#C5A56A] shadow-md group-hover:bg-[#B65F43] transition-colors border border-[#C5A56A]/40">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="font-serif text-2xl font-bold tracking-tight text-[#253451] group-hover:text-[#B65F43] transition-colors">
              Kala Vaibhav
            </div>
            <div className="text-[10px] uppercase tracking-widest text-[#B65F43] font-semibold -mt-1">
              Heritage Artisan Marketplace
            </div>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center space-x-7 text-sm font-medium text-[#272522]">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`transition-colors py-1 relative ${
                  isActive
                    ? 'text-[#B65F43] font-semibold'
                    : 'text-[#272522]/80 hover:text-[#B65F43]'
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B65F43] rounded-full"></span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          {/* Artisan Studio / Voice Sell Button */}
          {isArtisan ? (
            <Link
              href="/artisan/create"
              className="hidden sm:inline-flex items-center gap-2 bg-[#B65F43] hover:bg-[#974931] text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-all"
            >
              <Mic className="w-4 h-4 animate-pulse text-[#FAF7F0]" />
              <span>Kala Mitra: Sell Craft</span>
            </Link>
          ) : (
            <Link
              href="/custom"
              className="hidden sm:inline-flex items-center gap-2 border border-[#C5A56A] text-[#253451] hover:bg-[#C5A56A]/10 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Palette className="w-4 h-4 text-[#B65F43]" />
              <span>Commission Craft</span>
            </Link>
          )}

          {/* Role Dashboard Shortcuts */}
          {isArtisan && (
            <Link
              href="/artisan/dashboard"
              className="hidden lg:inline-flex items-center gap-1.5 text-xs text-[#253451] bg-[#FAF7F0] hover:bg-[#E8E2D6] border border-[#E8E2D6] px-3 py-2 rounded-lg font-medium"
            >
              Artisan Studio
            </Link>
          )}

          {isAdmin && (
            <Link
              href="/admin"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-purple-900 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3 py-2 rounded-lg font-medium"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Panel</span>
            </Link>
          )}

          {/* Cart Icon */}
          <Link
            href="/cart"
            className="relative p-2 text-[#253451] hover:text-[#B65F43] transition-colors rounded-lg hover:bg-white"
            aria-label="View Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#B65F43] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                {totalCount}
              </span>
            )}
          </Link>

          {/* User Account / Orders Link */}
          <Link
            href="/orders"
            className="p-2 text-[#253451] hover:text-[#B65F43] transition-colors rounded-lg hover:bg-white"
            title="My Orders"
          >
            <UserIcon className="w-5 h-5" />
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#253451]"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#E8E2D6] px-4 pt-3 pb-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-[#272522] hover:text-[#B65F43]"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-3 border-t border-gray-100 space-y-2">
            <Link
              href="/artisan/create"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 w-full justify-center bg-[#B65F43] text-white py-2.5 rounded-lg text-sm font-medium"
            >
              <Mic className="w-4 h-4" />
              <span>Kala Mitra: Sell with Voice</span>
            </Link>
            {isArtisan && (
              <Link
                href="/artisan/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2 text-sm text-[#253451] border border-[#E8E2D6] rounded-lg"
              >
                Artisan Studio Dashboard
              </Link>
            )}
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2 text-sm text-purple-800 bg-purple-50 rounded-lg"
              >
                Admin Platform Dashboard
              </Link>
            )}
            <Link
              href="/orders"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-center py-2 text-sm text-gray-700 hover:text-black"
            >
              My Orders & Commissions
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
