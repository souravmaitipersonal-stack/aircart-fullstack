'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    const isNew = localStorage.getItem('newUser');

    if (!token || !userData) {
      router.push('/auth/login');
      return;
    }

    try {
      setUser(JSON.parse(userData));
      if (isNew === 'true') {
        setIsNewUser(true);
        localStorage.removeItem('newUser');
      }
    } catch (error) {
      router.push('/auth/login');
    }
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    document.cookie = 'authToken=; path=/; max-age=0';
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
          <p className="mt-4 text-slate-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900">
      {isNewUser && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-500/20 to-cyan-500/20 border border-green-500/50 mx-4 mt-4 rounded-lg p-6"
        >
          <div className="flex items-center gap-4">
            <span className="text-4xl">🎉</span>
            <div>
              <h2 className="text-xl font-bold text-green-400 mb-1">Welcome to AirCart!</h2>
              <p className="text-slate-300">Your account has been created successfully. Start exploring products and building your cart.</p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-white mb-2">Welcome, {user?.name}! 👋</h1>
          <p className="text-slate-400 mb-12">Here is your account overview and quick actions</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-800/50 rounded-lg border border-slate-700 p-6"
          >
            <h2 className="text-xl font-bold text-white mb-4">👤 Profile</h2>
            <div className="space-y-3">
              <div>
                <p className="text-slate-400 text-sm">Name</p>
                <p className="text-white font-medium">{user?.name}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Email</p>
                <p className="text-white font-medium text-sm break-all">{user?.email}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Role</p>
                <span className="inline-block mt-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 text-cyan-400 px-3 py-1 rounded-full text-sm font-medium capitalize">
                  {user?.role}
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800/50 rounded-lg border border-slate-700 p-6"
          >
            <h2 className="text-xl font-bold text-white mb-4">📦 Orders</h2>
            <div className="space-y-3">
              <div>
                <p className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">0</p>
                <p className="text-slate-400">Total Orders</p>
              </div>
              <Link
                href="/orders"
                className="block w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-2 px-4 rounded-lg transition hover:opacity-90 text-center font-medium mt-4"
              >
                View Orders
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-800/50 rounded-lg border border-slate-700 p-6"
          >
            <h2 className="text-xl font-bold text-white mb-4">⚡ Quick Actions</h2>
            <div className="space-y-2">
              <button className="w-full text-left bg-slate-700/50 hover:bg-slate-700 py-2 px-4 rounded-lg transition text-slate-300 text-sm">
                📝 Edit Profile
              </button>
              <button className="w-full text-left bg-slate-700/50 hover:bg-slate-700 py-2 px-4 rounded-lg transition text-slate-300 text-sm">
                🔐 Change Password
              </button>
              <Link
                href="/products"
                className="block w-full text-left bg-slate-700/50 hover:bg-slate-700 py-2 px-4 rounded-lg transition text-slate-300 text-sm"
              >
                🛍️ Start Shopping
              </Link>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg p-6 mb-12"
        >
          <h2 className="text-xl font-bold text-white mb-4">🚀 Next Steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/products"
              className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition group"
            >
              <span className="text-2xl group-hover:scale-110 transition">🛍️</span>
              <div>
                <p className="text-white font-medium">Browse Products</p>
                <p className="text-slate-400 text-sm">Explore our collection</p>
              </div>
            </Link>
            <Link
              href="/cart"
              className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition group"
            >
              <span className="text-2xl group-hover:scale-110 transition">🛒</span>
              <div>
                <p className="text-white font-medium">View Cart</p>
                <p className="text-slate-400 text-sm">Check your items</p>
              </div>
            </Link>
          </div>
        </motion.div>

        <div>
          <button
            onClick={handleLogout}
            className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 px-6 py-3 rounded-lg transition font-medium"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
}
