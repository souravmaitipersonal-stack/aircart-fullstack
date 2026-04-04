'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/auth';
import { ProtectedRoute } from '@/components/ProtectedRoute';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
}

function AdminDashboardContent({ stats }: { stats: DashboardStats }) {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Admin Navbar */}
      <nav className="sticky top-0 z-40 bg-white shadow-md border-b border-neutral-200">
        <div className="container-wide flex justify-between items-center h-16 px-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl">⚙️</div>
            <div>
              <h1 className="font-bold text-neutral-900">Admin Panel</h1>
              <p className="text-xs text-neutral-600">AirCart Management</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-neutral-600 hover:text-blue-600 transition-colors">
              ← Back to Store
            </Link>
          </div>
        </div>
      </nav>

      <div className="container-wide py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-neutral-900">Welcome back, Admin! 👋</h2>
          <p className="text-neutral-600 mt-2">Here's what's happening with your store today</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {/* Products */}
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-neutral-600 text-sm font-medium">Total Products</p>
                <p className="text-3xl font-bold text-neutral-900 mt-2">{stats.totalProducts}</p>
                <p className="text-xs text-blue-600 mt-2">+3 this week</p>
              </div>
              <span className="text-3xl">📦</span>
            </div>
          </div>

          {/* Orders */}
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-neutral-600 text-sm font-medium">Total Orders</p>
                <p className="text-3xl font-bold text-neutral-900 mt-2">{stats.totalOrders}</p>
                <p className="text-xs text-green-600 mt-2">+45 this week</p>
              </div>
              <span className="text-3xl">🛍️</span>
            </div>
          </div>

          {/* Users */}
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-neutral-600 text-sm font-medium">Total Users</p>
                <p className="text-3xl font-bold text-neutral-900 mt-2">{stats.totalUsers}</p>
                <p className="text-xs text-purple-600 mt-2">+120 this week</p>
              </div>
              <span className="text-3xl">👥</span>
            </div>
          </div>

          {/* Revenue */}
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-neutral-600 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold text-neutral-900 mt-2">${(stats.totalRevenue / 1000).toFixed(0)}K</p>
                <p className="text-xs text-yellow-600 mt-2">+12% this week</p>
              </div>
              <span className="text-3xl">💰</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/admin/products" className="group">
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-lg hover:border-blue-200 border border-neutral-200 transition-all cursor-pointer">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📦</div>
              <h3 className="font-semibold text-neutral-900 text-lg mb-2">Manage Products</h3>
              <p className="text-neutral-600 text-sm mb-4">Add, edit, or delete products from your catalog</p>
              <span className="text-blue-600 font-medium text-sm">Go to Products →</span>
            </div>
          </Link>

          <Link href="/admin/orders" className="group">
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-lg hover:border-green-200 border border-neutral-200 transition-all cursor-pointer">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📋</div>
              <h3 className="font-semibold text-neutral-900 text-lg mb-2">Manage Orders</h3>
              <p className="text-neutral-600 text-sm mb-4">View and process customer orders</p>
              <span className="text-green-600 font-medium text-sm">Go to Orders →</span>
            </div>
          </Link>

          <Link href="/admin/users" className="group">
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-lg hover:border-purple-200 border border-neutral-200 transition-all cursor-pointer">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">👥</div>
              <h3 className="font-semibold text-neutral-900 text-lg mb-2">Manage Users</h3>
              <p className="text-neutral-600 text-sm mb-4">View and manage customer accounts</p>
              <span className="text-purple-600 font-medium text-sm">Go to Users →</span>
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="font-semibold text-neutral-900 text-lg mb-4">📊 Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
              <span className="text-neutral-700">New order #1245 received</span>
              <span className="text-xs text-neutral-500">2 minutes ago</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
              <span className="text-neutral-700">Product "Wireless Earbuds" added</span>
              <span className="text-xs text-neutral-500">1 hour ago</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
              <span className="text-neutral-700">3 new user registrations</span>
              <span className="text-xs text-neutral-500">3 hours ago</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
              <span className="text-neutral-700">Payment received for order #1240</span>
              <span className="text-xs text-neutral-500">5 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats] = useState<DashboardStats>({
    totalProducts: 48,
    totalOrders: 1250,
    totalUsers: 5000,
    totalRevenue: 125000,
  });

  return (
    <ProtectedRoute requiredRole="admin">
      <AdminDashboardContent stats={stats} />
    </ProtectedRoute>
  );
}
