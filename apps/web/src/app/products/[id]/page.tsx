/**
 * Product Details Page
 * Phase 3: Individual Product View
 * Path: apps/web/src/app/products/[id]/page.tsx
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Product } from '@/components/ProductCard';
import { productAPI } from '@/lib/api';
import { useCart } from '@/store/cart';

export default function ProductDetailsPage() {
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const { addItem } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await productAPI.getById(productId) as any;
      if (response.success && response.data) {
        setProduct(response.data as Product);
      } else {
        setError(response.error || 'Product not found');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    setIsAdding(true);
    try {
      await addItem(product.id, product.name, product.price, product.image, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    } catch (err) {
      alert('Failed to add item to cart');
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-4xl mb-4">⚠️</p>
          <p className="text-xl text-gray-600 mb-6">{error || 'Product not found'}</p>
          <Link
            href="/products"
            className="text-blue-600 hover:text-blue-700 font-medium underline"
          >
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const discountedPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;
  const savings = product.discount ? product.price - discountedPrice : 0;

  return (
    <div>
      {/* Header Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/products" className="text-blue-600 hover:text-blue-700">
              Products
            </Link>
            <span>/</span>
            <span>{product.category || 'Category'}</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div>
            <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center h-96 relative">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <div className="text-gray-400 text-6xl">📦</div>
              )}

              {product.featured && (
                <div className="absolute top-4 left-4 bg-yellow-400 text-gray-900 px-4 py-2 rounded-full font-bold">
                  ⭐ Featured
                </div>
              )}

              {product.discount && (
                <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full font-bold text-lg">
                  -{product.discount}%
                </div>
              )}
            </div>

            {/* Additional Images (Future) */}
            <div className="flex gap-4 mt-6">
              {[1, 2, 3].map((i) => (
                <button
                  key={i}
                  className="w-20 h-20 bg-gray-200 rounded-lg hover:border-2 hover:border-blue-600 transition-colors"
                >
                  <div className="text-gray-400 text-2xl">📷</div>
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div>
            {/* Category */}
            {product.category && (
              <p className="text-sm text-gray-500 uppercase tracking-wide mb-4">
                {product.category}
              </p>
            )}

            {/* Name */}
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center">
                  <div className="text-yellow-400 text-xl">⭐</div>
                  <span className="ml-2 text-lg font-bold text-gray-900">{product.rating}</span>
                  {product.reviews && (
                    <span className="ml-2 text-gray-600">({product.reviews} reviews)</span>
                  )}
                </div>
              </div>
            )}

            {/* Price */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              {product.discount ? (
                <div>
                  <p className="text-lg text-gray-500 line-through mb-2">
                    ${product.price.toFixed(2)}
                  </p>
                  <div className="flex items-baseline gap-4">
                    <p className="text-4xl font-bold text-blue-600">
                      ${discountedPrice.toFixed(2)}
                    </p>
                    {savings > 0 && (
                      <p className="text-lg text-green-600 font-bold">
                        Save ${savings.toFixed(2)} ({product.discount}%)
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-4xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="mb-8">
                <h2 className="text-lg font-bold mb-4">Description</h2>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Stock Status */}
            <div className="mb-8">
              <p className={`text-lg font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                {product.inStock ? `✓ In Stock (${product.stock || 'Many'} available)` : '✗ Out of Stock'}
              </p>
            </div>

            {/* Quantity Selector */}
            {product.inStock && (
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 px-3 py-2 border border-gray-300 rounded-lg text-center font-medium"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            <div className="flex gap-4 mb-12">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock || isAdding}
                className={`flex-1 py-3 px-6 rounded-lg font-bold text-lg transition-all ${
                  product.inStock
                    ? addedToCart
                      ? 'bg-green-600 text-white'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isAdding ? 'Adding...' : addedToCart ? '✓ Added to Cart!' : '🛒 Add to Cart'}
              </button>
              <button className="px-6 py-3 border-2 border-gray-300 rounded-lg font-bold hover:border-gray-400 transition-colors">
                ❤️
              </button>
            </div>

            {/* Guarantees */}
            <div className="space-y-4 pt-8 border-t border-gray-200">
              <div className="flex gap-4">
                <div className="text-2xl">🚚</div>
                <div>
                  <p className="font-bold text-gray-900">Free Shipping</p>
                  <p className="text-sm text-gray-600">On orders over $50</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-2xl">🔒</div>
                <div>
                  <p className="font-bold text-gray-900">Secure Payment</p>
                  <p className="text-sm text-gray-600">100% encrypted transactions</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-2xl">↩️</div>
                <div>
                  <p className="font-bold text-gray-900">Easy Returns</p>
                  <p className="text-sm text-gray-600">30-day return guarantee</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
