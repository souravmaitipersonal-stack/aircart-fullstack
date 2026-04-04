'use client';

import type { Metadata } from 'next';
import '../styles/globals.css';
import Link from 'next/link';
import { CartIcon } from '@/components/CartIcon';
import OptionBasedChatbot from '@/components/OptionBasedChatbot';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';

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

function LayoutContent({ children }: LayoutProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  // Prevent rendering until hydration is complete
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [dropdownOpen]);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    router.push('/auth/login');
  };

  if (!mounted) {
    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>AirCart - E-Commerce, Elevated</title>
          <meta name="description" content="Premium ecommerce platform with modern features and secure transactions" />
        </head>
        <body>
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-pulse">Loading...</div>
          </div>
        </body>
      </html>
    );
  }

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
        <nav className="sticky top-0 z-50 bg-slate-900 border-b border-slate-700 backdrop-blur-lg bg-opacity-95">
          <div className="max-w-7xl mx-auto flex justify-between items-center h-16 px-4 sm:px-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                ✦
              </div>
              <div>
                <p className="text-lg font-bold text-white hidden sm:block">AirCart</p>
                <p className="hidden sm:block text-xs text-slate-400 font-semibold tracking-wide">E-Commerce, Elevated</p>
              </div>
            </Link>

            {/* Nav Links */}
            <div className="flex gap-1 sm:gap-8 items-center">
              <Link href="/" className="text-slate-300 hover:text-blue-400 font-medium transition-colors hidden sm:block text-sm">
                Home
              </Link>
              <Link href="/products" className="text-slate-300 hover:text-blue-400 font-medium transition-colors hidden sm:block text-sm">
                Products
              </Link>
              <Link href="/products?featured=true" className="text-slate-300 hover:text-blue-400 font-medium transition-colors hidden sm:block text-sm">
                Featured
              </Link>
              <CartIcon />
              {user && user !== null ? (
                <div className="relative" ref={dropdownRef}>
                  {/* User Profile Button with Dropdown */}
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
                    title={`Click to open menu for ${user.name}`}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold">
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span className="text-slate-200 font-medium hidden sm:block max-w-[100px] truncate text-sm">{user.name}</span>
                    <svg
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 flex-shrink-0 ${dropdownOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 overflow-hidden z-50 animate-in fade-in-0 zoom-in-95 origin-top-right">
                      {/* User Info Header */}
                      <div className="px-4 py-4 border-b border-slate-700 bg-slate-700">
                        <p className="text-sm font-bold text-white">{user.name}</p>
                        <p className="text-xs text-slate-300 truncate font-medium">{user.email}</p>
                        {user.role && <p className="text-xs text-cyan-400 font-semibold capitalize mt-1">📌 {user.role}</p>}
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          href="/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-cyan-400 transition-colors duration-150"
                        >
                          <span className="text-lg">👤</span>
                          <div>
                            <p className="text-sm font-medium">My Dashboard</p>
                            <p className="text-xs text-slate-500">View profile & stats</p>
                          </div>
                        </Link>
                        <Link
                          href="/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-cyan-400 transition-colors duration-150"
                        >
                          <span className="text-lg">📦</span>
                          <div>
                            <p className="text-sm font-medium">My Orders</p>
                            <p className="text-xs text-slate-500">Track purchases</p>
                          </div>
                        </Link>
                        <Link
                          href="/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-cyan-400 transition-colors duration-150"
                        >
                          <span className="text-lg">⚙️</span>
                          <div>
                            <p className="text-sm font-medium">Settings</p>
                            <p className="text-xs text-slate-500">Manage account</p>
                          </div>
                        </Link>
                        {user.role === 'admin' && (
                          <Link
                            href="/admin"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-cyan-400 transition-colors duration-150"
                          >
                            <span className="text-lg">🔧</span>
                            <div>
                              <p className="text-sm font-medium">Admin Panel</p>
                              <p className="text-xs text-slate-500">Manage products</p>
                            </div>
                          </Link>
                        )}
                        <Link
                          href="/"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-cyan-400 transition-colors duration-150"
                        >
                          <span className="text-lg">❓</span>
                          <div>
                            <p className="text-sm font-medium">Help & Support</p>
                            <p className="text-xs text-slate-500">Get assistance</p>
                          </div>
                        </Link>
                      </div>

                      {/* Logout Button */}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-slate-300 hover:bg-red-900/30 hover:text-red-400 transition-colors duration-150 border-t border-slate-700 flex items-center gap-3 font-medium"
                      >
                        <span className="text-lg">🚪</span>
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link href="/auth/login" className="text-slate-300 hover:text-cyan-400 font-medium transition-colors hidden sm:block text-sm">
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all hover:shadow-lg font-medium text-sm"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
          {children}
        </main>

        {/* Chatbot Widget */}
        <OptionBasedChatbot />

        {/* Footer */}
        <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
              {/* Brand */}
              <div>
                <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">AirCart</h3>
                <p className="text-neutral-400">Premium e-commerce platform with modern features and secure transactions.</p>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="font-semibold mb-4 text-white">Shop</h4>
                <ul className="space-y-2 text-neutral-400">
                  <li>
                    <a href="/products" className="hover:text-blue-400 transition-colors">Products</a>
                  </li>
                  <li>
                    <a href="/products" className="hover:text-blue-400 transition-colors">Categories</a>
                  </li>
                  <li>
                    <a href="/" className="hover:text-blue-400 transition-colors">Deals</a>
                  </li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h4 className="font-semibold mb-4 text-white">Support</h4>
                <ul className="space-y-2 text-neutral-400">
                  <li>
                    <a href="/" className="hover:text-blue-400 transition-colors">Help Center</a>
                  </li>
                  <li>
                    <a href="/" className="hover:text-blue-400 transition-colors">FAQ</a>
                  </li>
                  <li>
                    <a href="/" className="hover:text-blue-400 transition-colors">Contact</a>
                  </li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h4 className="font-semibold mb-4 text-white">Legal</h4>
                <ul className="space-y-2 text-neutral-400">
                  <li>
                    <a href="/" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
                  </li>
                  <li>
                    <a href="/" className="hover:text-blue-400 transition-colors">Terms of Service</a>
                  </li>
                  <li>
                    <a href="/" className="hover:text-blue-400 transition-colors">Cookie Policy</a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Footer Bottom */}
            <div className="border-t border-neutral-700 pt-8 text-center text-neutral-400">
              <p>© 2026 AirCart. All rights reserved. | E-Commerce, Elevated.</p>
              <p className="text-xs mt-2">Built with Next.js, Express.js, and Node.js</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <AuthProvider>
      <LayoutContent>{children}</LayoutContent>
    </AuthProvider>
  );
}
