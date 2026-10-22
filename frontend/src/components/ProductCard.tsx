'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { ShieldCheck, Clock, MapPin, ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const primaryImage =
    product.images?.[0]?.imageUrl ||
    'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="group warm-card overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1">
      {/* Product Image Frame */}
      <Link href={`/products/${product.id}`} className="relative h-64 w-full bg-[#F4EFE6] overflow-hidden block">
        <img
          src={primaryImage}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Craft Badge */}
        <div className="absolute top-3 left-3 bg-[#253451]/90 backdrop-blur-sm text-[#FAF7F0] text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-sm">
          {product.craftType}
        </div>

        {/* Provenance Badge */}
        <div className="absolute top-3 right-3 bg-white/95 text-[#253451] text-[10px] font-semibold px-2 py-0.5 rounded shadow-sm flex items-center gap-1 border border-[#E8E2D6]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#B65F43]" />
          <span>Passport Verified</span>
        </div>

        {/* Time to make pill */}
        {product.timeToMake && (
          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{product.timeToMake} handwork</span>
          </div>
        )}
      </Link>

      {/* Details Area */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Artisan Maker Info */}
          <div className="flex items-center justify-between text-xs text-[#5C5853] mb-2">
            <span className="font-medium text-[#253451]">By {product.artisanName || 'Master Artisan'}</span>
            {product.region && (
              <span className="flex items-center gap-0.5 text-[11px]">
                <MapPin className="w-3 h-3 text-[#B65F43]" />
                {product.region}
              </span>
            )}
          </div>

          {/* Title */}
          <Link href={`/products/${product.id}`}>
            <h3 className="font-serif text-lg font-bold text-[#272522] group-hover:text-[#B65F43] transition-colors line-clamp-1 mb-1.5">
              {product.title}
            </h3>
          </Link>

          {/* Description */}
          <p className="text-xs text-[#5C5853] line-clamp-2 leading-relaxed mb-4">
            {product.description}
          </p>
        </div>

        {/* Price & Add to Cart Action */}
        <div className="pt-3 border-t border-[#E8E2D6] flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Artisan Price</div>
            <div className="font-serif text-xl font-bold text-[#253451]">
              ₹{product.price.toLocaleString('en-IN')}
            </div>
          </div>

          <button
            onClick={() => addToCart(product)}
            className="flex items-center gap-1.5 bg-[#FAF7F0] hover:bg-[#B65F43] text-[#253451] hover:text-white border border-[#C5A56A] hover:border-[#B65F43] px-3.5 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all active:scale-95"
            title="Add to Cart"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
