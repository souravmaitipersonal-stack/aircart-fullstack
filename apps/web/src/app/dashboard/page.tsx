'use client';

/**
 * Dashboard Page - User Profile & Account
 * Phase 2: After Login Landing Page
 * Path: apps/web/src/app/dashboard/page.tsx
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/auth/login');
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch (error) {
      router.push('/auth/login');
    }
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="text-2xl font-bold text-blue-600">AirCart</div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-12">Welcome, {user?.name}! 👋</h1>

        {/* User Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">👤 Profile</h2>
            <div className="space-y-3">
              <div>
                <p className="text-gray-600 text-sm">Name</p>
                <p className="font-medium">{user?.name}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Email</p>
                <p className="font-medium">{user?.email}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Role</p>
                <span className="inline-block mt-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium capitalize">
                  {user?.role}
                </span>
              </div>
            </div>
          </div>

          {/* Orders Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">📦 Orders</h2>
            <div className="space-y-3">
              <div>
                <p className="text-4xl font-bold text-blue-600">0</p>
                <p className="text-gray-600">Total Orders</p>
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition mt-4">
                View Orders
              </button>
            </div>
          </div>

          {/* Account Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">⚙️ Account</h2>
            <div className="space-y-2">
              <button className="w-full text-left bg-gray-50 hover:bg-gray-100 py-2 px-4 rounded-lg transition text-gray-700">
                Edit Profile
              </button>
              <button className="w-full text-left bg-gray-50 hover:bg-gray-100 py-2 px-4 rounded-lg transition text-gray-700">
                Change Password
              </button>
              <button className="w-full text-left bg-gray-50 hover:bg-gray-100 py-2 px-4 rounded-lg transition text-gray-700">
                Address Book
              </button>
            </div>
          </div>
        </div>

        {/* Phase 2 Status */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-3">🚀 Phase 2 Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <p className="font-medium">User Authentication</p>
                <p className="text-sm text-gray-600">JWT-based login/register</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">⏳</span>
              <div>
                <p className="font-medium">Database Integration</p>
                <p className="text-sm text-gray-600">Coming in Phase 3</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">⏳</span>
              <div>
                <p className="font-medium">Product Management</p>
                <p className="text-sm text-gray-600">Coming in Phase 3</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">⏳</span>
              <div>
                <p className="font-medium">Admin Dashboard</p>
                <p className="text-sm text-gray-600">Coming in Phase 5</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
