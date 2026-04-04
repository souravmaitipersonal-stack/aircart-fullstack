'use client';

import Link from 'next/link';
import { useState } from 'react';

interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  email: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  items: number;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      orderNumber: '#ORD-001245',
      customer: 'John Smith',
      email: 'john@example.com',
      total: 299.99,
      status: 'processing',
      date: '2026-03-28',
      items: 3,
    },
    {
      id: '2',
      orderNumber: '#ORD-001244',
      customer: 'Jane Doe',
      email: 'jane@example.com',
      total: 149.99,
      status: 'delivered',
      date: '2026-03-27',
      items: 2,
    },
    {
      id: '3',
      orderNumber: '#ORD-001243',
      customer: 'Bob Johnson',
      email: 'bob@example.com',
      total: 499.99,
      status: 'shipped',
      date: '2026-03-26',
      items: 5,
    },
  ]);

  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-neutral-100 text-neutral-800';
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
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
            <div className="text-xl">📋</div>
            <h1 className="font-bold text-neutral-900">Orders Management</h1>
          </div>
        </div>
      </nav>

      <div className="container-wide py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-neutral-900">Orders</h2>
          <p className="text-neutral-600 mt-2">Total: {orders.length} orders</p>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-neutral-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-100 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">Order #</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">Customer</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-neutral-900">Items</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-neutral-900">Total</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">Date</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-neutral-900">Status</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-neutral-900">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} className="border-b border-neutral-200 hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4 text-neutral-900 font-semibold">{order.orderNumber}</td>
                    <td className="px-6 py-4">
                      <div className="text-neutral-900 font-medium">{order.customer}</div>
                      <div className="text-neutral-600 text-sm">{order.email}</div>
                    </td>
                    <td className="px-6 py-4 text-right text-neutral-900">{order.items}</td>
                    <td className="px-6 py-4 text-right font-semibold text-neutral-900">${order.total.toFixed(2)}</td>
                    <td className="px-6 py-4 text-neutral-600 text-sm">{order.date}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                        className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
                      >
                        {selectedOrder === order.id ? 'Hide' : 'Details'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Details */}
        {selectedOrder && (
          <div className="mt-8 bg-white rounded-lg shadow-sm p-8 border border-neutral-200">
            <h3 className="text-2xl font-bold mb-6">
              {orders.find(o => o.id === selectedOrder)?.orderNumber} - Order Details
            </h3>

            {orders.find(o => o.id === selectedOrder) && (
              <div>
                {/* Customer Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h4 className="font-semibold text-neutral-900 mb-4">Customer Information</h4>
                    <div className="space-y-2 text-neutral-700">
                      <p><span className="font-medium">Name:</span> {orders.find(o => o.id === selectedOrder)?.customer}</p>
                      <p><span className="font-medium">Email:</span> {orders.find(o => o.id === selectedOrder)?.email}</p>
                      <p><span className="font-medium">Order Date:</span> {orders.find(o => o.id === selectedOrder)?.date}</p>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div>
                    <h4 className="font-semibold text-neutral-900 mb-4">Order Summary</h4>
                    <div className="space-y-2 text-neutral-700">
                      <p><span className="font-medium">Items:</span> {orders.find(o => o.id === selectedOrder)?.items}</p>
                      <p><span className="font-medium">Total:</span> ${orders.find(o => o.id === selectedOrder)?.total.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                {/* Status Update */}
                <div>
                  <h4 className="font-semibold text-neutral-900 mb-4">Update Status</h4>
                  <div className="flex gap-2 flex-wrap">
                    {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
                      <button
                        key={status}
                        onClick={() => updateOrderStatus(selectedOrder, status as Order['status'])}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          orders.find(o => o.id === selectedOrder)?.status === status
                            ? 'bg-blue-600 text-white'
                            : 'bg-neutral-200 text-neutral-800 hover:bg-neutral-300'
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
