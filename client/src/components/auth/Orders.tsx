import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { paymentService } from '../../services/paymentService';
import { Order } from '../../types';

const Orders: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoadingOrders(true);
      try {
        const data = await paymentService.getOrdersByUser();
        setOrders(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders.');
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>Please log in to view your orders.</div>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md dark:bg-gray-800 dark:text-gray-200">
      <h2 className="text-2xl font-semibold mb-4 dark:text-gray-100">My Orders</h2>
      {loadingOrders ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">You have no orders yet.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map(order => (
            <li key={order.id} className="p-4 border rounded-lg dark:border-gray-700">
              <div className="flex justify-between items-center">
                <span className="font-medium">Order #{order.id}</span>
                <span className="text-sm px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full">
                  {order.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Placed on {new Date(order.created_at).toLocaleDateString()}
              </p>
              <p className="text-sm mt-2">
                Total: €{order.total.toFixed(2)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Orders;
