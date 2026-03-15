/**
 * Cart Icon Component
 * Phase 3: Shopping Cart Navigation Component
 * Path: apps/web/src/components/CartIcon.tsx
 */

'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCart } from '@/store/cart';

export function CartIcon() {
  const [mounted, setMounted] = useState(false);
  const { items } = useCart();

  useEffect(() => {
    setMounted(true);
  }, []);

  const itemCount = items.length;

  if (!mounted) {
    return null;
  }

  return (
    <Link href="/cart" className="relative group">
      <div className="text-2xl hover:scale-110 transition-transform">🛒</div>
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
      <div className="absolute right-0 mt-2 hidden group-hover:block bg-gray-900 text-white px-3 py-1 rounded text-sm whitespace-nowrap pointer-events-none">
        {itemCount} {itemCount === 1 ? 'item' : 'items'}
      </div>
    </Link>
  );
}
