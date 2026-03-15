/**
 * Product Card Component
 * Phase 3: Product Display Component
 * Path: apps/web/src/components/ProductCard.tsx
 */

'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/store/cart';

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  category?: string;
  rating?: number;
  reviews?: number;
  inStock?: boolean;
  stock?: number;
  discount?: number;
  featured?: boolean;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCart();

  const discountedPrice = product.discount ? product.price * (1 - product.discount / 100) : product.price;
  const savings = product.discount ? product.price - discountedPrice : 0;

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      if (onAddToCart) {
        onAddToCart(product);
      } else {
        await addItem(product.id, product.name, product.price, product.image);
      }
      // Could add toast notification here
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Product Image */}
      <div className="relative bg-gray-200 h-48 overflow-hidden flex items-center justify-center">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform"
          />
        ) : (
          <div className="text-gray-400 text-4xl">📦</div>
        )}

        {/* Stock Badge */}
        {!product.inStock && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Out of Stock
          </div>
        )}

        {/* Featured Badge */}
        {product.featured && (
          <div className="absolute top-2 left-2 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
            ⭐ Featured
          </div>
        )}

        {/* Discount Badge */}
        {product.discount && (
          <div className="absolute bottom-2 right-2 bg-red-600 text-white px-3 py-1 rounded text-sm font-bold">
            -{product.discount}%
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category */}
        {product.category && (
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">{product.category}</p>
        )}

        {/* Name */}
        <Link href={`/products/${product.id}`}>
          <h3 className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors mb-2 line-clamp-2 cursor-pointer">
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        {product.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
        )}

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-2 mb-3">
            <div className="text-yellow-400">⭐</div>
            <span className="text-sm font-medium text-gray-900">{product.rating}</span>
            {product.reviews && <span className="text-xs text-gray-500">({product.reviews} reviews)</span>}
          </div>
        )}

        {/* Price */}
        <div className="mb-4">
          {product.discount ? (
            <div>
              <p className="text-xs text-gray-500 line-through">${product.price.toFixed(2)}</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-blue-600">${discountedPrice.toFixed(2)}</p>
                {savings > 0 && <p className="text-sm text-green-600 font-medium">Save ${savings.toFixed(2)}</p>}
              </div>
            </div>
          ) : (
            <p className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock || isAdding}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
            product.inStock
              ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          } ${isAdding ? 'opacity-75' : ''}`}
        >
          {isAdding ? 'Adding...' : product.inStock ? '🛒 Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
}
