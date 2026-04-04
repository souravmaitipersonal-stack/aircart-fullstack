'use client';

import { useCartStore } from '@/store/useCartStore';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function OrderReviewPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, shippingAddress, getTotal } = useCartStore();

  if (!shippingAddress) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-300 mb-4">No shipping address found</p>
          <button
            onClick={() => router.push('/cart')}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Back to Cart
          </button>
        </div>
      </div>
    );
  }

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 99 : 0;
  const tax = Math.round(subtotal * 0.05 * 100) / 100;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 p-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">📋 Order Review</h1>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Order Items */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-2 space-y-4"
          >
            <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-4">📦 Order Items</h2>
              {items.length === 0 ? (
                <p className="text-slate-400">No items in cart</p>
              ) : (
                <div className="space-y-3">
                  {items.map((item: any) => (
                    <div
                      key={item.product.id}
                      className="flex justify-between items-center pb-3 border-b border-slate-700"
                    >
                      <div>
                        <p className="text-white font-medium">{item.product.name}</p>
                        <p className="text-slate-400 text-sm">₹{item.product.price.toLocaleString()} × {item.quantity}</p>
                      </div>
                      <p className="text-cyan-400 font-semibold">
                        ₹{(item.product.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Shipping Address */}
            <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">📍 Delivery Address</h2>
                <button
                  onClick={() => router.push('/checkout/shipping')}
                  className="text-blue-400 hover:text-blue-300 text-sm underline"
                >
                  Edit
                </button>
              </div>
              <div className="space-y-2 text-slate-300">
                <p><strong>{shippingAddress.fullName}</strong></p>
                <p>{shippingAddress.address}</p>
                <p>{shippingAddress.city}, {shippingAddress.postalCode}</p>
                <p>{shippingAddress.country}</p>
                <p className="pt-2">📧 {shippingAddress.email}</p>
                <p>📱 {shippingAddress.phone}</p>
              </div>
            </div>
          </motion.div>

          {/* Price Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-1"
          >
            <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-lg p-6 border border-cyan-500/50 sticky top-4">
              <h3 className="text-lg font-bold text-white mb-4">💰 Order Summary</h3>
              <div className="space-y-3 text-slate-300">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-white">₹{shipping}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (5%)</span>
                  <span className="text-white">₹{tax.toLocaleString()}</span>
                </div>
                <div className="border-t border-slate-600 pt-3 flex justify-between text-lg font-bold">
                  <span className="text-white">Total</span>
                  <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    ₹{total.toLocaleString()}
                  </span>
                </div>
              </div>

              <motion.button
                onClick={() => router.push('/checkout/payment')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-lg font-semibold mt-6 hover:opacity-90 transition"
              >
                Proceed to Payment →
              </motion.button>

              <button
                onClick={() => router.push('/cart')}
                className="w-full mt-2 border border-slate-600 text-slate-300 py-2 rounded-lg hover:bg-slate-700/50 transition"
              >
                ← Back to Cart
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
