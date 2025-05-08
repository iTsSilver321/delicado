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

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Manage Orders</h2>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Order ID</th>
            <th className="border px-4 py-2">Customer Email</th>
            <th className="border px-4 py-2">Date</th>
            <th className="border px-4 py-2">Total (€)</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id}>
              <td className="border px-4 py-2">{o.id}</td>
              <td className="border px-4 py-2">{o.email || 'Guest'}</td>
              <td className="border px-4 py-2">{new Date(o.created_at).toLocaleDateString()}</td>
              <td className="border px-4 py-2">{o.total_amount.toFixed(2)}</td>
              <td className="border px-4 py-2">
                <select
                  value={o.status}
                  onChange={e => handleStatusChange(o.id, e.target.value as any)}
                  className="border rounded px-2 py-1"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="refunded">Refunded</option>
                </select>
              </td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleStatusChange(o.id, o.status)}
                  disabled={updatingId === o.id}
                  className={`px-3 py-1 rounded ${updatingId === o.id ? 'bg-gray-400' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
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