'use client';

import type { Metadata } from 'next';
import '../styles/globals.css';
import Link from 'next/link';
import { CartIcon } from '@/components/CartIcon';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Note: Metadata cannot be used in 'use client' component
// This will be handled by a separate server component
const metadata = {
  title: 'AirCart - E-Commerce, Elevated',
  description: 'Premium ecommerce platform with modern features and secure transactions',
  viewport: 'width=device-width, initial-scale=1',
};

interface LayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error('Failed to parse user data');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>AirCart - E-Commerce, Elevated</title>
        <meta name="description" content="Premium ecommerce platform with modern features and secure transactions" />
      </head>
      <body>
        {/* Navigation */}
        <nav className="sticky top-0 z-50 bg-white shadow-card">
          <div className="container-wide flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
                AirCart
              </div>
              <p className="text-sm text-neutral-600 font-medium">E-Commerce, Elevated</p>
            </Link>

            {/* Nav Links */}
            <div className="flex gap-6 items-center">
              <Link href="/" className="text-neutral-700 hover:text-primary-600 font-medium">
                Home
              </Link>
              <Link href="/products" className="text-neutral-700 hover:text-primary-600 font-medium">
                Products
              </Link>
              <CartIcon />
              {user ? (
                <>
                  <Link href="/dashboard" className="text-neutral-700 hover:text-primary-600 font-medium">
                    Account
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-neutral-700 hover:text-primary-600 font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="text-neutral-700 hover:text-primary-600 font-medium">
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="min-h-screen">{children}</main>

        {/* Footer */}
        <footer className="bg-neutral-900 text-white mt-20">
          <div className="container-wide py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              {/* Brand */}
              <div>
                <h3 className="text-xl font-bold mb-4">AirCart</h3>
                <p className="text-neutral-400">E-Commerce, Elevated.</p>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="font-semibold mb-4">Shop</h4>
                <ul className="space-y-2 text-neutral-400">
                  <li>
                    <a href="/products">Products</a>
                  </li>
                  <li>
                    <a href="/categories">Categories</a>
                  </li>
                  <li>
                    <a href="/deals">Deals</a>
                  </li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-neutral-400">
                  <li>
                    <a href="/help">Help Center</a>
                  </li>
                  <li>
                    <a href="/faq">FAQ</a>
                  </li>
                  <li>
                    <a href="/contact">Contact</a>
                  </li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-neutral-400">
                  <li>
                    <a href="/privacy">Privacy</a>
                  </li>
                  <li>
                    <a href="/terms">Terms</a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Footer Bottom */}
            <div className="border-t border-neutral-800 pt-8 text-center text-neutral-400">
              <p>© 2026 AirCart. All rights reserved. E-Commerce, Elevated.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
