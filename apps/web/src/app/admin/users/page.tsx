'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { adminUsersAPI } from '@/lib/api';
import { motion } from 'framer-motion';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'admin' | 'customer';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin: string | null;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [editingEmail, setEditingEmail] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<User>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Load users on mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await adminUsersAPI.getAll();
      if (response.success && response.data) {
        setUsers(response.data as User[]);
      } else {
        setError(response.error || 'Failed to load users');
      }
    } catch (err) {
      setError('Failed to load users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (email: string) => {
    try {
      const response = await adminUsersAPI.delete(email);
      if (response.success) {
        setUsers(users.filter(u => u.email !== email));
        setDeleteConfirm(null);
      } else {
        setError(response.error || 'Failed to delete user');
      }
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  const handleUpdate = async (email: string) => {
    try {
      const response = await adminUsersAPI.update(email, editForm);
      if (response.success) {
        setUsers(users.map(u => u.email === email ? { ...u, ...editForm } : u));
        setEditingEmail(null);
        setEditForm({});
      } else {
        setError(response.error || 'Failed to update user');
      }
    } catch (err) {
      setError('Failed to update user');
    }
  };

  const togglePasswordVisibility = (email: string) => {
    setShowPassword(prev => ({
      ...prev,
      [email]: !prev[email]
    }));
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-slate-800/80 backdrop-blur border-b border-slate-700">
        <div className="container mx-auto flex justify-between items-center h-16 px-4">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-slate-300 hover:text-cyan-400 transition-colors">
              ← Admin Panel
            </Link>
            <h1 className="text-2xl font-bold text-white">Users Management</h1>
          </div>
          <Link href="/admin" className="text-slate-300 hover:text-cyan-400 transition-colors">
            Dashboard
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="container mx-auto p-4 py-8">
        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-900/30 border border-red-700/50 text-red-200 px-4 py-3 rounded-lg mb-6"
          >
            ⚠️ {error}
          </motion.div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
          </div>
        ) : (
          <>
            {/* Users Count */}
            <div className="mb-6 text-slate-300">
              <p className="text-lg">Total Users: <span className="font-bold text-cyan-400">{users.length}</span></p>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full bg-slate-800/50 rounded-lg overflow-hidden border border-slate-700">
                <thead>
                  <tr className="bg-slate-700 text-slate-200">
                    <th className="px-4 py-3 text-left font-semibold">Name</th>
                    <th className="px-4 py-3 text-left font-semibold">Email</th>
                    <th className="px-4 py-3 text-left font-semibold">Password</th>
                    <th className="px-4 py-3 text-left font-semibold">Role</th>
                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                    <th className="px-4 py-3 text-left font-semibold">Joined</th>
                    <th className="px-4 py-3 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <motion.tr
                      key={user.email}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors"
                    >
                      {editingEmail === user.email ? (
                        <>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={editForm.name || user.name}
                              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                              className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                            />
                          </td>
                          <td className="px-4 py-3 text-slate-200">{user.email}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <input
                                type={showPassword[user.email] ? 'text' : 'password'}
                                value={editForm.password || user.password}
                                onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                                className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                              />
                              <button
                                onClick={() => togglePasswordVisibility(user.email)}
                                className="p-1 hover:bg-slate-600 rounded"
                                title={showPassword[user.email] ? 'Hide' : 'Show'}
                              >
                                {showPassword[user.email] ? '👁️' : '👁️‍🗨️'}
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={editForm.role || user.role}
                              onChange={(e) => setEditForm({ ...editForm, role: e.target.value as 'admin' | 'customer' })}
                              className="px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                            >
                              <option value="customer">Customer</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={editForm.isActive !== undefined ? (editForm.isActive ? 'active' : 'inactive') : (user.isActive ? 'active' : 'inactive')}
                              onChange={(e) => setEditForm({ ...editForm, isActive: e.target.value === 'active' })}
                              className="px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                            >
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                            </select>
                          </td>
                          <td className="px-4 py-3 text-slate-400 text-sm">{formatDate(user.createdAt)}</td>
                          <td className="px-4 py-3 space-x-2">
                            <button
                              onClick={() => handleUpdate(user.email)}
                              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingEmail(null)}
                              className="px-3 py-1 bg-slate-600 hover:bg-slate-700 text-white rounded text-sm transition"
                            >
                              Cancel
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-3 text-slate-200">{user.name}</td>
                          <td className="px-4 py-3 text-slate-200">{user.email}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <code className="text-xs bg-slate-700 px-2 py-1 rounded text-cyan-300">
                                {showPassword[user.email] ? user.password : '••••••••••••'}
                              </code>
                              <button
                                onClick={() => togglePasswordVisibility(user.email)}
                                className="p-1 hover:bg-slate-700 rounded transition text-lg"
                                title={showPassword[user.email] ? 'Hide password' : 'Show password'}
                              >
                                {showPassword[user.email] ? '👁️' : '👁️‍🗨️'}
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-3 py-1 rounded text-xs font-semibold ${
                              user.role === 'admin'
                                ? 'bg-purple-900/50 text-purple-300 border border-purple-700'
                                : 'bg-blue-900/50 text-blue-300 border border-blue-700'
                            }`}>
                              {user.role.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-3 py-1 rounded text-xs font-semibold ${
                              user.isActive
                                ? 'bg-green-900/50 text-green-300 border border-green-700'
                                : 'bg-red-900/50 text-red-300 border border-red-700'
                            }`}>
                              {user.isActive ? 'ACTIVE' : 'INACTIVE'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-400 text-sm">{formatDate(user.createdAt)}</td>
                          <td className="px-4 py-3 space-x-2">
                            <button
                              onClick={() => {
                                setEditingEmail(user.email);
                                setEditForm({ ...user });
                              }}
                              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(user.email)}
                              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition"
                              disabled={user.email === 'admin@aircart.com'} // Prevent deleting main admin
                            >
                              Delete
                            </button>
                          </td>
                        </>
                      )}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-slate-800 rounded-lg p-6 max-w-sm w-full border border-slate-700"
                >
                  <h3 className="text-xl font-bold text-white mb-4">Confirm Delete</h3>
                  <p className="text-slate-300 mb-6">Are you sure you want to delete this user?</p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleDelete(deleteConfirm)}
                      className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded transition"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
