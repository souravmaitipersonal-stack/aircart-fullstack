'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { productAPI } from '@/lib/api';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
  description?: string;
  stock?: number;
  sku?: string;
  dateAdded?: string;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Wireless Earbuds Pro',
      price: 129.99,
      category: 'Electronics',
      stock: 45,
      sku: 'WEB-001',
      dateAdded: '2026-03-28',
    },
    {
      id: '2',
      name: 'USB-C Cable (2m)',
      price: 19.99,
      category: 'Accessories',
      stock: 150,
      sku: 'ACC-001',
      dateAdded: '2026-03-25',
    },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Electronics',
    stock: '',
    sku: '',
    description: '',
  });

  const handleAddProduct = () => {
    if (!formData.name || !formData.price) {
      alert('Please fill in required fields');
      return;
    }

    if (editingId) {
      // Update existing product
      setProducts(
        products.map(p =>
          p.id === editingId
            ? {
              ...p,
              name: formData.name,
              price: parseFloat(formData.price),
              category: formData.category,
              stock: parseInt(formData.stock) || 0,
              sku: formData.sku,
              description: formData.description,
            }
            : p
        )
      );
      setEditingId(null);
    } else {
      // Add new product
      const newProduct: Product = {
        id: Date.now().toString(),
        name: formData.name,
        price: parseFloat(formData.price),
        category: formData.category,
        stock: parseInt(formData.stock) || 0,
        sku: formData.sku,
        description: formData.description,
        dateAdded: new Date().toISOString().split('T')[0],
      };
      setProducts([...products, newProduct]);
    }

    // Reset form
    setFormData({
      name: '',
      price: '',
      category: 'Electronics',
      stock: '',
      sku: '',
      description: '',
    });
    setShowForm(false);
  };

  const handleEditProduct = (product: Product) => {
    setFormData({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock?.toString() || '',
      sku: product.sku || '',
      description: product.description || '',
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      name: '',
      price: '',
      category: 'Electronics',
      stock: '',
      sku: '',
      description: '',
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white shadow-md border-b border-neutral-200">
        <div className="container-wide flex justify-between items-center h-16 px-4">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-neutral-600 hover:text-blue-600 transition-colors">
              ← Admin Panel
            </Link>
            <div className="text-xl">📦</div>
            <h1 className="font-bold text-neutral-900">Products Management</h1>
          </div>
        </div>
      </nav>

      <div className="container-wide py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-neutral-900">Products</h2>
            <p className="text-neutral-600 mt-2">Total: {products.length} products</p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              + Add Product
            </button>
          )}
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8 border border-neutral-200">
            <h3 className="text-2xl font-bold mb-6">
              {editingId ? 'Edit Product' : 'Add New Product'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter product name"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Electronics</option>
                  <option>Accessories</option>
                  <option>Clothing</option>
                  <option>Books</option>
                  <option>Home</option>
                  <option>Other</option>
                </select>
              </div>

              {/* SKU */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  SKU (Product ID)
                </label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={e => setFormData({ ...formData, sku: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., PROD-001"
                />
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={e => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter product description"
                  rows={3}
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 mt-8">
              <button
                onClick={handleAddProduct}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {editingId ? 'Update Product' : 'Add Product'}
              </button>
              <button
                onClick={handleCancel}
                className="px-6 py-2 bg-neutral-200 text-neutral-800 rounded-lg hover:bg-neutral-300 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-neutral-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-100 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">Product</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">SKU</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">Category</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-neutral-900">Price</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-neutral-900">Stock</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">Added</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-neutral-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} className="border-b border-neutral-200 hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4 text-neutral-900 font-medium">{product.name}</td>
                    <td className="px-6 py-4 text-neutral-600 text-sm">{product.sku || '-'}</td>
                    <td className="px-6 py-4 text-neutral-600">{product.category}</td>
                    <td className="px-6 py-4 text-right font-semibold text-neutral-900">${product.price.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        product.stock! > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.stock || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-neutral-600 text-sm">{product.dateAdded}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium ml-2"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {products.length === 0 && !showForm && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-neutral-200">
            <div className="text-5xl mb-4">📦</div>
            <p className="text-neutral-600 text-lg mb-6">No products yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Add Your First Product
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
