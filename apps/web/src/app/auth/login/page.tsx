'use client';

/**
 * Login Page - Modern Dark Theme
 * Phase 2: User Authentication Frontend
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { authAPI } from '@/lib/api';
import AnimatedContainer from '@/components/AnimatedContainer';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await authAPI.login(formData.email, formData.password);

      if (!response.success) {
        const errorMessage = response.error || 'Login failed';
        setError(errorMessage);
        return;
      }

      // Store token and user data in localStorage
      const responseData = response.data as any;
      if (responseData?.token) {
        localStorage.setItem('token', responseData.token);
      }
      if (responseData?.user) {
        localStorage.setItem('user', JSON.stringify(responseData.user));
        setSuccess(`Welcome back, ${responseData.user.name}!`);
      }

      // Redirect after short delay
      setTimeout(() => {
        router.push(responseData?.user?.role === 'admin' ? '/admin' : '/');
      }, 1000);
      
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Network error occurred';
      setError(`Failed to connect to server: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background blobs */}
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/10 blur-3xl"
        animate={{ y: [0, 50, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        style={{ pointerEvents: 'none' }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-gradient-to-br from-cyan-500/10 to-transparent blur-3xl"
        animate={{ y: [0, -50, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        style={{ pointerEvents: 'none' }}
      />

      <div className="relative z-10 w-full max-w-md">
        <AnimatedContainer variant="scaleIn">
          <div className="bg-slate-800/80 backdrop-blur-xl rounded-3xl border border-slate-700 shadow-2xl p-8 md:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                className="inline-flex items-center justify-center gap-2 mb-6"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold">
                  ✦
                </div>
              </motion.div>
              <h1 className="text-3xl font-bold text-white mb-1">AirCart</h1>
              <p className="text-slate-400 mb-6">E-Commerce, Elevated</p>
              <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
              <p className="text-slate-400 text-sm mt-2">Sign in to continue shopping</p>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-900/30 border border-red-700/50 text-red-200 px-4 py-3 rounded-lg mb-6 text-sm"
              >
                ⚠️ {error}
              </motion.div>
            )}

            {/* Success Message */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-900/30 border border-green-700/50 text-green-200 px-4 py-3 rounded-lg mb-6 text-sm"
              >
                ✓ {success}
              </motion.div>
            )}

            {/* Demo Credentials Info */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-6 text-xs text-slate-300">
              <p className="font-semibold text-blue-300 mb-2">📌 Demo Credentials:</p>
              <p>Email: <code className="text-cyan-400">admin@aircart.com</code></p>
              <p>Password: <code className="text-cyan-400">Demo@123!Pass</code></p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <motion.div whileFocus={{ scale: 1.02 }} className="relative">
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 text-white placeholder-slate-500 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 focus:outline-none transition"
                  placeholder="you@example.com"
                />
              </motion.div>

              {/* Password */}
              <motion.div whileFocus={{ scale: 1.02 }} className="relative">
                <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 text-white placeholder-slate-500 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 focus:outline-none transition"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-300"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </motion.div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded bg-slate-700 border-slate-600" />
                  <span className="text-slate-400">Remember me</span>
                </label>
                <Link href="#" className="text-cyan-400 hover:text-cyan-300 font-medium">
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold py-3 px-4 rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="flex-1 h-px bg-slate-700"></div>
              <span className="text-xs text-slate-500">or</span>
              <div className="flex-1 h-px bg-slate-700"></div>
            </div>

            {/* Signup Link */}
            <p className="text-center text-slate-400 text-sm">
              Don't have an account?{' '}
              <Link href="/auth/register" className="text-cyan-400 hover:text-cyan-300 font-semibold">
                Sign up
              </Link>
            </p>

            {/* Back to Home */}
            <Link href="/" className="block text-center mt-6 text-slate-400 hover:text-slate-300 text-sm transition">
              ← Back to Home
            </Link>
          </div>
        </AnimatedContainer>
      </div>
    </div>
  );
}
