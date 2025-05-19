import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import { OrderAdmin } from '../../types';

const OrdersAdmin: React.FC = () => {
  const [orders, setOrders] = useState<OrderAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    api.get<OrderAdmin[]>('/payments/admin/orders')
      .then(res => setOrders(res.data))
      .catch(err => { console.error(err); setError('Failed to load orders'); })
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = (id: number, newStatus: OrderAdmin['status']) => {
    setUpdatingId(id);
    api.put(`/payments/admin/orders/${id}`, { status: newStatus })
      .then(() => {
        setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
      })
      .catch(err => { console.error(err); alert('Failed to update status'); })
      .finally(() => setUpdatingId(null));
  };

  if (loading) return <p className="dark:text-accent-200">Loading orders...</p>;
  if (error) return <p className="text-red-600 dark:text-red-400">{error}</p>;

  return (
    <div className="dark:text-accent-200">
      <h2 className="text-2xl font-semibold mb-4">Manage Orders</h2>
      <table className="w-full table-auto border-collapse dark:border-accent-700 bg-white dark:bg-accent-800 shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-200 dark:bg-accent-700">
            <th className="border px-4 py-2 dark:border-accent-600">Order ID</th>
            <th className="border px-4 py-2 dark:border-accent-600">Customer Email</th>
            <th className="border px-4 py-2 dark:border-accent-600">Date</th>
            <th className="border px-4 py-2 dark:border-accent-600">Total (€)</th>
            <th className="border px-4 py-2 dark:border-accent-600">Status</th>
            <th className="border px-4 py-2 dark:border-accent-600">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id} className="dark:hover:bg-accent-700/50">
              <td className="border px-4 py-2 dark:border-accent-600">{o.id}</td>
              <td className="border px-4 py-2 dark:border-accent-600">{o.email || 'Guest'}</td>
              <td className="border px-4 py-2 dark:border-accent-600">{new Date(o.created_at).toLocaleDateString()}</td>
              <td className="border px-4 py-2 dark:border-accent-600">{Number(o.total_amount).toFixed(2)}</td>
              <td className="border px-4 py-2 dark:border-accent-600">
                <select
                  value={o.status}
                  onChange={e => handleStatusChange(o.id, e.target.value as any)}
                  className="border rounded px-2 py-1 dark:bg-accent-700 dark:border-accent-600 dark:text-accent-200 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="pending" className="dark:bg-accent-700">Pending</option>
                  <option value="processing" className="dark:bg-accent-700">Processing</option>
                  <option value="completed" className="dark:bg-accent-700">Completed</option>
                  <option value="cancelled" className="dark:bg-accent-700">Cancelled</option>
                  <option value="refunded" className="dark:bg-accent-700">Refunded</option>
                </select>
              </td>
              <td className="border px-4 py-2 dark:border-accent-600">
                <button
                  onClick={() => handleStatusChange(o.id, o.status)}
                  disabled={updatingId === o.id}
                  className={`px-3 py-1 rounded ${updatingId === o.id ? 'bg-gray-400 dark:bg-accent-600' : 'bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                >
                  {updatingId === o.id ? 'Updating...' : 'Update'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersAdmin;