/**
 * Product Filters Component
 * Phase 3: Advanced Product Filtering
 * Path: apps/web/src/components/ProductFilters.tsx
 */

'use client';

import { useState } from 'react';

interface FilterOptions {
  search: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  sort: string;
  featured: boolean;
  inStock: boolean;
}

interface ProductFiltersProps {
  onFilterChange: (filters: Partial<FilterOptions>) => void;
  categories?: string[];
}

export function ProductFilters({ onFilterChange, categories = ['Electronics', 'Accessories', 'Software', 'Other'] }: ProductFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    category: '',
    minPrice: 0,
    maxPrice: 10000,
    sort: 'newest',
    featured: false,
    inStock: false,
  });

  const [showFilters, setShowFilters] = useState(false);

  const handleChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange({ [key]: value });
  };

  const handleReset = () => {
    const resetFilters = {
      search: '',
      category: '',
      minPrice: 0,
      maxPrice: 10000,
      sort: 'newest',
      featured: false,
      inStock: false,
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      {/* Toggle Button (Mobile) */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="md:hidden w-full mb-4 flex items-center justify-between bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors"
      >
        <span className="font-medium">🔍 Filters</span>
        <span>{showFilters ? '▲' : '▼'}</span>
      </button>

      {/* Filters Container */}
      <div className={`grid grid-cols-1 md:grid-cols-5 gap-4 ${!showFilters && 'hidden md:grid'}`}>
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
          <input
            type="text"
            placeholder="Product name..."
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            value={filters.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range (${filters.minPrice}-${filters.maxPrice})
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              min="0"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => handleChange('minPrice', Number(e.target.value))}
              className="w-1/2 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <input
              type="number"
              max="10000"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => handleChange('maxPrice', Number(e.target.value))}
              className="w-1/2 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
          <select
            value={filters.sort}
            onChange={(e) => handleChange('sort', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
            <option value="name">Name (A-Z)</option>
            <option value="rating">Rating</option>
          </select>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-col gap-2">
          <label className="block text-sm font-medium text-gray-700">Quick Filters</label>
          <div className="flex gap-2">
            <button
              onClick={() => handleChange('featured', !filters.featured)}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filters.featured
                  ? 'bg-yellow-400 text-gray-900'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ⭐ Featured
            </button>
            <button
              onClick={() => handleChange('inStock', !filters.inStock)}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filters.inStock
                  ? 'bg-green-400 text-gray-900'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ✓ In Stock
            </button>
          </div>
          <button
            onClick={handleReset}
            className="w-full px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
