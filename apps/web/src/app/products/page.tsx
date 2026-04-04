'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useProductStore } from '@/store/useProductStore';
import { useCartStore } from '@/store/useCartStore';
import { useRouter } from 'next/navigation';

interface FilterState {
  search: string;
  category: string;
  minPrice: number;
  maxPrice: number;
}

export default function ProductsPage() {
  const router = useRouter();
  const { products, searchProducts } = useProductStore();
  const { addItem } = useCartStore();
  
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: '',
    minPrice: 0,
    maxPrice: 500000,
  });
  const [addedToCart, setAddedToCart] = useState<string | null>(null);

  useEffect(() => {
    applyFilters();
  }, [products, filters]);

  const applyFilters = () => {
    let filtered = [...products];

    if (filters.search) {
      filtered = searchProducts(filters.search);
    }

    if (filters.category) {
      filtered = filtered.filter((p) => p.category === filters.category);
    }

    filtered = filtered.filter((p) => {
      const price = (p as any).discount ? p.price * (1 - (p as any).discount / 100) : p.price;
      return price >= filters.minPrice && price <= filters.maxPrice;
    });

    setFilteredProducts(filtered);
  };

  const handleAddToCart = (product: any) => {
    addItem(product, 1);
    setAddedToCart(product.id);
    setTimeout(() => setAddedToCart(null), 2000);
  };

  const categories = ['mobile', 'laptop', 'audio', 'gaming'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 p-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🛍️ Shop Products</h1>
          <p className="text-slate-400">Browse our collection of premium electronics</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 sticky top-4">
              <h3 className="text-white font-bold mb-4">🔍 Filters</h3>

              <div className="mb-4">
                <label className="block text-slate-300 text-sm font-medium mb-2">Search</label>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="mb-4">
                <label className="block text-slate-300 text-sm font-medium mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:border-cyan-500 focus:outline-none"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Max Price: ₹{filters.maxPrice.toLocaleString()}</label>
                <input
                  type="range"
                  min="0"
                  max="500000"
                  step="5000"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
            </div>
          </motion.div>

          <div className="lg:col-span-3">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.length === 0 ? (
                <div className="md:col-span-2 lg:col-span-3 text-center py-12">
                  <p className="text-slate-400 text-lg">No products found</p>
                </div>
              ) : (
                filteredProducts.map((product: any, idx: number) => {
                  const discount = product.discount || 0;
                  const finalPrice = product.price * (1 - discount / 100);

                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-slate-800/50 rounded-lg overflow-hidden border border-slate-700 hover:border-cyan-500/50 transition group"
                    >
                      <div className="relative h-48 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center overflow-hidden">
                        <div className="text-6xl group-hover:scale-110 transition">{product.emoji || '📱'}</div>
                        {discount > 0 && (
                          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                            -{discount}%
                          </div>
                        )}
                      </div>

                      <div className="p-4">
                        <h3 className="text-white font-bold mb-1">{product.name}</h3>
                        <p className="text-slate-400 text-sm mb-3 line-clamp-2">{product.description}</p>

                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-cyan-400 font-bold text-lg">₹{finalPrice.toLocaleString()}</span>
                          {discount > 0 && (
                            <span className="text-slate-500 line-through text-sm">₹{product.price.toLocaleString()}</span>
                          )}
                        </div>

                        <div className="mb-3">
                          <span className="inline-block bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs">
                            {product.category}
                          </span>
                        </div>

                        <motion.button
                          onClick={() => handleAddToCart(product)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`w-full py-2 rounded font-semibold transition ${
                            addedToCart === product.id
                              ? 'bg-green-500 text-white'
                              : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:opacity-90'
                          }`}
                        >
                          {addedToCart === product.id ? '✅ Added' : '🛒 Add to Cart'}
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
