/**
 * Checkout Page
 * Phase 4: Checkout & Payments (WIP)
 * Path: apps/web/src/app/checkout/page.tsx
 */

'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">Checkout</h1>
          <p className="text-blue-100 mt-2">Complete your purchase securely</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <p className="text-yellow-800">
            <strong>⚠️ Coming Soon:</strong> The checkout page is coming in Phase 4 with PayPal integration.
          </p>
        </div>

        <div className="text-center py-12">
          <p className="text-6xl mb-6">🔐</p>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Secure Checkout (Phase 4)</h2>
          <p className="text-gray-600 mb-8">
            This page will include PayPal payment integration, shipping address, and order confirmation.
          </p>

          <div className="space-y-4">
            <Link
              href="/cart"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold transition-colors"
            >
              ← Back to Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
