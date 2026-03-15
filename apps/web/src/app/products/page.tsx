/**
 * Products Page
 * Phase 3: Product Listing with Filters
 * Path: apps/web/src/app/products/page.tsx
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProductCard, Product } from '@/components/ProductCard';
import { ProductFilters } from '@/components/ProductFilters';
import { productAPI } from '@/lib/api';
import { useCart } from '@/store/cart';

interface FilterState {
  search: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  sort: string;
  featured: boolean;
  inStock: boolean;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: '',
    minPrice: 0,
    maxPrice: 10000,
    sort: 'newest',
    featured: false,
    inStock: false,
  });
  const { addItem } = useCart();

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Apply filters when products or filters change
  useEffect(() => {
    applyFilters();
  }, [products, filters]);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await productAPI.getProducts({
        limit: 100, // Get all products for client-side filtering
      }) as any;

      if (response.success && response.data) {
        setProducts(response.data.products || response.data || []);
      } else {
        setError(response.error || 'Failed to load products');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading products');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Search filter
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.description?.toLowerCase().includes(search)
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter((p) => p.category === filters.category);
    }

    // Price range filter
    filtered = filtered.filter((p) => {
      const price = p.discount ? p.price * (1 - p.discount / 100) : p.price;
      return price >= filters.minPrice && price <= filters.maxPrice;
    });

    // Featured filter
    if (filters.featured) {
      filtered = filtered.filter((p) => p.featured);
    }

    // Stock filter
    if (filters.inStock) {
      filtered = filtered.filter((p) => p.inStock !== false);
    }

    // Sorting
    switch (filters.sort) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
      default:
        // Keep original order (newest first from backend)
        break;
    }

    setFilteredProducts(filtered);
  };

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleAddToCart = async (product: Product) => {
    try {
      await addItem(product.id, product.name, product.price, product.image);
      // Show success message (could use toast)
      alert(`Added "${product.name}" to cart!`);
    } catch (err) {
      alert('Failed to add item to cart');
      console.error(err);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Shop Products</h1>
          <p className="text-blue-100">
            Browse our curated collection of {products.length} products
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <ProductFilters onFilterChange={handleFilterChange} />

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">
              <strong>Error:</strong> {error}
            </p>
            <button
              onClick={fetchProducts}
              className="mt-2 text-red-600 hover:text-red-700 font-medium underline"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div>
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
          </div>
        )}

        {/* No Results */}
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-xl text-gray-600 mb-4">
              No products found matching your filters
            </p>
            <button
              onClick={() => {
                setFilters({
                  search: '',
                  category: '',
                  minPrice: 0,
                  maxPrice: 10000,
                  sort: 'newest',
                  featured: false,
                  inStock: false,
                });
              }}
              className="text-blue-600 hover:text-blue-700 font-medium underline"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!loading && filteredProducts.length > 0 && (
          <div>
            <p className="text-gray-600 mb-6">
              Showing {filteredProducts.length} of {products.length} products
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
