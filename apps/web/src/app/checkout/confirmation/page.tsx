'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useCartStore } from '@/store/useCartStore';
import { Suspense } from 'react';

function ConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, clearCart } = useCartStore();

  const status = searchParams.get('status') || 'failure';
  const orderId = searchParams.get('orderId') || 'ORD-UNKNOWN';

  const isSuccess = status === 'success';

  const handleReturnHome = () => {
    clearCart();
    router.push('/');
  };

  const handleRetryPayment = () => {
    router.push('/checkout/payment');
  };

  const handleTrackOrder = () => {
    if (isSuccess) {
      router.push(`/orders/${orderId}`);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full"
        >
          {/* Success Icon */}
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-center mb-6"
          >
            <div className="text-7xl mb-4">✅</div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Payment Successful!
            </h1>
          </motion.div>

          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-slate-800 to-slate-800/50 rounded-lg p-6 border border-green-500/30 mb-6 text-center"
          >
            <p className="text-slate-400 mb-2">Order ID</p>
            <p className="text-2xl font-bold text-white mb-4">{orderId}</p>
            <p className="text-slate-400 text-sm">
              Confirmation email has been sent to your email address.
            </p>
          </motion.div>

          {/* Order Status Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-800/50 rounded-lg p-6 border border-slate-700 mb-6"
          >
            <h3 className="text-white font-bold mb-4">📦 Order Status</h3>
            <div className="space-y-3">
              {['Confirmed ✅', 'Processing 🔄', 'Shipped 🚚', 'In Transit 📍', 'Delivered 🎉'].map((step, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${idx === 0 ? 'bg-green-500' : idx < 2 ? 'bg-yellow-500' : 'bg-slate-600'}`}></div>
                  <span className={idx === 0 ? 'text-green-400 font-semibold' : idx < 2 ? 'text-yellow-400' : 'text-slate-400'}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-800/50 rounded-lg p-6 border border-slate-700 mb-6"
          >
            <h3 className="text-white font-bold mb-4">📋 Order Summary</h3>
            <div className="space-y-2 text-slate-300">
              {items.map((item: any) => (
                <div key={item.product.id} className="flex justify-between">
                  <span>{item.product.name} × {item.quantity}</span>
                  <span className="text-cyan-400">₹{(item.product.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Buttons */}
          <div className="space-y-3">
            <motion.button
              onClick={handleTrackOrder}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
            >
              📍 Track Order
            </motion.button>
            <motion.button
              onClick={handleReturnHome}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full border border-slate-600 text-slate-300 py-2 rounded-lg hover:bg-slate-700/50 transition"
            >
              🏠 Back to Home
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Failure State
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg w-full"
      >
        {/* Error Icon */}
        <div className="text-center mb-6">
          <div className="text-7xl mb-4">❌</div>
          <h1 className="text-4xl font-bold text-red-400">Payment Failed</h1>
        </div>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 mb-6 text-center"
        >
          <p className="text-slate-300">
            Your payment could not be processed. Please check your payment details and try again.
          </p>
        </motion.div>

        {/* Buttons */}
        <div className="space-y-3">
          <motion.button
            onClick={handleRetryPayment}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            🔄 Retry Payment
          </motion.button>
          <motion.button
            onClick={() => router.push('/cart')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full border border-slate-600 text-slate-300 py-2 rounded-lg hover:bg-slate-700/50 transition"
          >
            ← Back to Cart
          </motion.button>
          <motion.button
            onClick={handleReturnHome}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full border border-slate-600 text-slate-300 py-2 rounded-lg hover:bg-slate-700/50 transition"
          >
            🏠 Back to Home
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center"><p className="text-white">Loading...</p></div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
