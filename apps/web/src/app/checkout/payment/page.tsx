'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';

export default function PaymentPage() {
  const router = useRouter();
  const { getTotal } = useCartStore();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const paymentMethods = [
    { id: 'card', label: '💳 Credit Card', icon: '💳' },
    { id: 'debit', label: '💳 Debit Card', icon: '💳' },
    { id: 'upi', label: '📱 UPI', icon: '📱' },
    { id: 'paypal', label: '🅿️ PayPal', icon: '🅿️' },
    { id: 'wallet', label: '👛 Digital Wallet', icon: '👛' },
  ];

  const handlePayment = async () => {
    if (!selectedMethod) return;

    setProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      const success = Math.random() > 0.2; // 80% success rate
      const orderId = 'ORD-' + Date.now();

      if (success) {
        router.push(`/checkout/confirmation?status=success&orderId=${orderId}`);
      } else {
        router.push(`/checkout/confirmation?status=failure`);
      }
    }, 2000);
  };

  const total = getTotal();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 p-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">💳 Payment Method</h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 rounded-lg p-6 border border-slate-700 mb-6"
        >
          <h2 className="text-xl font-bold text-white mb-4">Order Total: ₹{total.toLocaleString()}</h2>
          <p className="text-slate-400">Select your preferred payment method below</p>
        </motion.div>

        {/* Payment Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {paymentMethods.map((method, idx) => (
            <motion.button
              key={method.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setSelectedMethod(method.id)}
              className={`p-4 rounded-lg border-2 transition ${
                selectedMethod === method.id
                  ? 'border-cyan-500 bg-cyan-500/10'
                  : 'border-slate-600 bg-slate-800/30 hover:border-slate-500'
              }`}
            >
              <div className="text-2xl mb-2">{method.icon}</div>
              <div className="text-left">
                <p className="font-semibold text-white">{method.label}</p>
                {method.id === 'card' && <p className="text-xs text-slate-400">Visa, Mastercard, Amex</p>}
                {method.id === 'upi' && <p className="text-xs text-slate-400">Google Pay, PhonePe, Paytm</p>}
                {method.id === 'wallet' && <p className="text-xs text-slate-400">ApplePay, GoogleWallet</p>}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Payment Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-cyan-500/50 rounded-lg p-4 mb-6"
        >
          <p className="text-slate-300 text-sm flex items-center gap-2">
            <span>🔒</span> Your payment information is secure and encrypted.
          </p>
        </motion.div>

        {/* Proceed Button */}
        <motion.button
          onClick={handlePayment}
          disabled={!selectedMethod || processing}
          whileHover={selectedMethod && !processing ? { scale: 1.02 } : {}}
          whileTap={selectedMethod && !processing ? { scale: 0.98 } : {}}
          className={`w-full py-3 rounded-lg font-semibold transition ${
            selectedMethod && !processing
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:opacity-90'
              : 'bg-slate-700 text-slate-400 cursor-not-allowed'
          }`}
        >
          {processing ? (
            <span className="flex items-center justify-center gap-2">
              <span className="inline-block animate-spin">⏳</span>
              Processing Payment...
            </span>
          ) : (
            `Pay ₹${total.toLocaleString()} →`
          )}
        </motion.button>

        <button
          onClick={() => router.push('/checkout/review')}
          className="w-full mt-2 border border-slate-600 text-slate-300 py-2 rounded-lg hover:bg-slate-700/50 transition"
          disabled={processing}
        >
          ← Back to Review
        </button>
      </div>
    </div>
  );
}
