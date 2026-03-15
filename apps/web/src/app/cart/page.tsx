/**
 * Shopping Cart Page
 * Phase 3: Cart View & Checkout
 * Path: apps/web/src/app/cart/page.tsx
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/store/cart';
import type { CartSummary } from '@/store/cart';

export default function CartPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { items, summary, loading, fetchCart, removeItem, updateQuantity, clearCart } = useCart();

  useEffect(() => {
    setMounted(true);
    fetchCart();
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">🛒 Shopping Cart</h1>
          <p className="text-blue-100 mt-2">
            {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {items.length === 0 ? (
          // Empty Cart
          <div className="text-center py-20">
            <p className="text-6xl mb-6">🛍️</p>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Start shopping to add items to your cart!</p>
            <Link
              href="/products"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Cart Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-900">Cart Items</h2>
                    <button
                      onClick={() => {
                        if (window.confirm('Clear all items from cart?')) {
                          clearCart();
                        }
                      }}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Clear Cart
                    </button>
                  </div>
                </div>

                {/* Items List */}
                <div className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex gap-6">
                        {/* Item Image */}
                        <div className="flex-shrink-0">
                          <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-2xl">📦</span>
                            )}
                          </div>
                        </div>

                        {/* Item Details */}
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/products/${item.productId}`}
                            className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors block mb-2"
                          >
                            {item.name}
                          </Link>
                          <p className="text-sm text-gray-600 mb-3">
                            ${item.price.toFixed(2)} each
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                            >
                              −
                            </button>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => {
                                const val = Math.max(1, parseInt(e.target.value) || 1);
                                updateQuantity(item.productId, val);
                              }}
                              className="w-12 px-2 py-1 border border-gray-300 rounded text-center font-medium text-sm"
                            />
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Price & Remove */}
                        <div className="flex flex-col items-end justify-between">
                          <p className="text-lg font-bold text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          <button
                            onClick={() => removeItem(item.productId)}
                            className="text-red-600 hover:text-red-700 font-medium text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Continue Shopping */}
              <Link
                href="/products"
                className="inline-block mt-6 text-blue-600 hover:text-blue-700 font-medium"
              >
                ← Continue Shopping
              </Link>
            </div>

            {/* Order Summary Sidebar */}
            <div>
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

                {summary && (
                  <div className="space-y-4 mb-6">
                    {/* Subtotal */}
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>${summary.subtotal.toFixed(2)}</span>
                    </div>

                    {/* Shipping (Future) */}
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span className="text-green-600 font-medium">Free</span>
                    </div>

                    {/* Tax */}
                    <div className="flex justify-between text-gray-600">
                      <span>Tax ({((summary.tax / summary.subtotal) * 100).toFixed(0)}%)</span>
                      <span>${summary.tax.toFixed(2)}</span>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between text-lg font-bold text-gray-900">
                        <span>Total</span>
                        <span className="text-blue-600">${summary.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Promo Code (Future) */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <input
                    type="text"
                    placeholder="Enter promo code"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Checkout Button */}
                <button
                  onClick={() => router.push('/checkout')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors mb-3"
                >
                  Proceed to Checkout
                </button>

                {/* Continue Shopping */}
                <button
                  onClick={() => router.push('/products')}
                  className="w-full bg-white border-2 border-gray-300 text-gray-900 font-bold py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Continue Shopping
                </button>

                {/* Guarantees */}
                <div className="mt-8 space-y-3 pt-8 border-t border-gray-200 text-sm text-gray-600">
                  <div className="flex gap-2">
                    <span className="text-lg">✓</span>
                    <span>Secure checkout with PayPal</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-lg">✓</span>
                    <span>30-day return guarantee</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-lg">✓</span>
                    <span>Free shipping over $50</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
