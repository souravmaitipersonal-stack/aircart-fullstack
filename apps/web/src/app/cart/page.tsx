'use client';

import { useCartStore } from '@/store/useCartStore';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function CartPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, removeItem, updateQuantity, getTotal, getItemCount } = useCartStore();
  const [proceed, setProceed] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <p className="text-xl text-slate-200 mb-6">Please login to view your cart</p>
          <Link
            href="/auth/login"
            className="inline-block bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Login
          </Link>
        </motion.div>
      </div>
    );
  }

  if (items.length === 0 && !proceed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 p-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Shopping Cart</h1>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800/50 rounded-lg p-8 text-center border border-slate-700"
          >
            <p className="text-2xl mb-4">🛒</p>
            <p className="text-xl text-slate-200 mb-6">Your cart is empty</p>
            <Link
              href="/products"
              className="inline-block bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
            >
              Continue Shopping
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 p-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">🛒 Shopping Cart</h1>

        {/* Cart Items */}
        <div className="space-y-4 mb-8">
          {items.map((item) => (
            <motion.div
              key={item.product.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-slate-800/50 rounded-lg p-6 border border-slate-700 flex justify-between items-center"
            >
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">{item.product.name}</h3>
                <p className="text-slate-400 text-sm">Price: ₹{item.product.price.toLocaleString()}</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                    className="px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-white transition"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-white">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-white transition"
                  >
                    +
                  </button>
                </div>

                <div className="text-right min-w-[120px]">
                  <p className="text-lg font-bold text-cyan-400">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                </div>

                <button
                  onClick={() => removeItem(item.product.id)}
                  className="px-3 py-1 bg-red-600/20 hover:bg-red-600/40 text-red-300 rounded transition text-sm"
                >
                  Remove
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary and Checkout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 rounded-lg p-6 border border-slate-700"
        >
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-slate-300">
              <span>Subtotal ({getItemCount()} items):</span>
              <span>₹{getTotal().toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Shipping:</span>
              <span>₹0 (Free)</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-cyan-400 border-t border-slate-700 pt-3">
              <span>Total:</span>
              <span>₹{getTotal().toLocaleString()}</span>
            </div>
          </div>

          <motion.button
            onClick={() => setProceed(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Proceed to Checkout
          </motion.button>

          {/* Confirmation */}
          {proceed && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-green-900/30 border border-green-700/50 rounded-lg text-green-200 text-center"
            >
              <p className="mb-4">✓ Ready to proceed with checkout?</p>
              <motion.button
                onClick={() => router.push('/checkout/shipping')}
                whileHover={{ scale: 1.05 }}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition"
              >
                Continue to Shipping →
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
