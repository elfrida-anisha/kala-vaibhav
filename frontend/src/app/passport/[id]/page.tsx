'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { CraftPassport, Product } from '@/lib/types';
import DigitalCraftPassportCard from '@/components/DigitalCraftPassportCard';
import {
  Award,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Share2,
  Printer,
  Loader2,
  AlertCircle,
} from 'lucide-react';

export default function PassportDetailPage() {
  const params = useParams();
  const productId = params?.id as string;
  const [passport, setPassport] = useState<CraftPassport | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPassport() {
      if (!productId) return;
      setIsLoading(true);
      try {
        const prodRes = await api.getProduct(productId);
        setProduct(prodRes.product);
        if (prodRes.passport) {
          setPassport(prodRes.passport);
        }
      } catch (err) {
        console.error('Error loading passport:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadPassport();
  }, [productId]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#B65F43]" />
        <p className="text-xs text-gray-500 font-medium">Verifying provenance certificate...</p>
      </div>
    );
  }

  if (!passport) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-gray-300 mx-auto" />
        <h2 className="font-serif text-2xl font-bold text-[#253451]">Passport Not Found</h2>
        <Link href="/explore" className="text-xs text-[#B65F43] font-semibold hover:underline">
          Return to Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Link href="/" className="hover:text-gray-700">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/explore" className="hover:text-gray-700">Crafts</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        {product && (
          <Link href={`/products/${product.id}`} className="hover:text-gray-700 truncate max-w-xs">
            {product.title}
          </Link>
        )}
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#253451] font-semibold">Craft Passport</span>
      </div>

      {/* Top Banner Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E2D6]">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#253451]">
            Official Provenance Certificate
          </h1>
          <p className="text-xs text-[#5C5853] mt-0.5">
            Cryptographically logged provenance record under Kala Vaibhav Heritage Protocol.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 bg-white border border-[#E8E2D6] px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Certificate</span>
          </button>

          {product && (
            <Link
              href={`/products/${product.id}`}
              className="bg-[#253451] hover:bg-[#34486E] text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span>View Product Listing</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* The Passport Card Component */}
      <DigitalCraftPassportCard
        passport={passport}
        productId={productId}
        artisanName={product?.artisanName}
      />
    </div>
  );
}
