'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Product } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import {
  Search,
  Filter,
  SlidersHorizontal,
  ArrowUpDown,
  RotateCcw,
  Sparkles,
  MapPin,
  Tag,
  Loader2,
} from 'lucide-react';

function ExploreContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState('newest');

  const categories = [
    'All Crafts',
    'Textiles & Embroidery',
    'Pottery & Ceramics',
    'Toys & Living',
    'Metalcraft & Brass',
    'Paintings & Folk Art',
  ];

  const regions = ['All Regions', 'Karnataka', 'Rajasthan', 'Odisha', 'Gujarat', 'West Bengal'];

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const categoryParam = selectedCategory === 'All Crafts' ? '' : selectedCategory;
      const res = await api.getProducts({
        category: categoryParam,
        search,
        minPrice,
        maxPrice,
        sort: sortOrder,
      });

      let filtered = res.products;
      if (selectedRegion && selectedRegion !== 'All Regions') {
        filtered = filtered.filter((p) => p.region?.includes(selectedRegion));
      }
      setProducts(filtered);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedRegion, sortOrder]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('All Crafts');
    setSelectedRegion('All Regions');
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setSortOrder('newest');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-[#E8E2D6] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B65F43] uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A56A]" />
            <span>Masterpiece Catalogue</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#253451]">
            Explore Handcrafted Indian Heritage
          </h1>
          <p className="text-xs text-[#5C5853] mt-1 max-w-xl">
            Every product is handcrafted by certified traditional artisans, accompanied by an authentic
            Digital Craft Passport and documented Craft Journey.
          </p>
        </div>

        <div className="text-xs text-gray-500 font-medium">
          Showing <span className="font-bold text-[#253451]">{products.length}</span> verified craft listings
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E8E2D6] shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by craft name (Kasuti, Blue Pottery), artisan, or material..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#FAF7F0] border border-[#E8E2D6] rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#B65F43]"
            />
          </div>

          <button
            type="submit"
            className="bg-[#253451] hover:bg-[#34486E] text-white px-6 py-2.5 rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
          </button>
        </form>

        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat || (!selectedCategory && cat === 'All Crafts');
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat === 'All Crafts' ? '' : cat)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full font-medium transition-all ${
                  isSelected
                    ? 'bg-[#B65F43] text-white shadow-xs'
                    : 'bg-[#FAF7F0] text-gray-700 hover:bg-[#E8E2D6] border border-[#E8E2D6]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Secondary Filter Row: Region & Sorting */}
        <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            {/* Region Select */}
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#B65F43]" />
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="bg-[#FAF7F0] border border-[#E8E2D6] rounded-lg px-2.5 py-1.5 text-xs text-gray-700"
              >
                {regions.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Filter */}
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Price:</span>
              <input
                type="number"
                placeholder="Min ₹"
                value={minPrice || ''}
                onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : undefined)}
                className="w-20 bg-[#FAF7F0] border border-[#E8E2D6] rounded-lg px-2 py-1 text-xs"
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                placeholder="Max ₹"
                value={maxPrice || ''}
                onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
                className="w-20 bg-[#FAF7F0] border border-[#E8E2D6] rounded-lg px-2 py-1 text-xs"
              />
              <button
                onClick={fetchProducts}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1 rounded-lg text-[11px] font-medium"
              >
                Apply
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="bg-[#FAF7F0] border border-[#E8E2D6] rounded-lg px-2.5 py-1.5 text-xs text-gray-700 font-medium"
              >
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>

            {/* Reset */}
            <button
              onClick={handleResetFilters}
              className="text-gray-400 hover:text-gray-700 flex items-center gap-1 text-[11px]"
              title="Reset all filters"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="text-center py-24 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#B65F43] mx-auto" />
          <p className="text-xs text-gray-500">Loading authentic artisan listings...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-[#E8E2D6] p-8 space-y-4">
          <Tag className="w-10 h-10 text-gray-300 mx-auto" />
          <div>
            <h3 className="font-serif text-lg font-bold text-[#253451]">No Crafts Found</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              We couldn&apos;t find matching crafts with your current filters. Try resetting filters or search
              with different terms.
            </p>
          </div>
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1.5 bg-[#253451] text-white px-4 py-2 rounded-lg text-xs font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-gray-500">Loading catalog...</div>}>
      <ExploreContent />
    </Suspense>
  );
}
