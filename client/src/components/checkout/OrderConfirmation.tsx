import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { paymentService } from '../../services/paymentService';

interface OrderDetails {
  id: number;
  status: string;
  total_amount: number;
  items: any[];
  shipping_address: any;
  created_at: string;
}

const OrderConfirmation: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!orderId) {
          setError('Order ID is missing');
          setLoading(false);
          return;
        }
        
        const orderData = await paymentService.getOrderById(parseInt(orderId));
        // Ensure total_amount is a number before setting the state
        if (orderData && typeof orderData.total_amount === 'string') {
          orderData.total_amount = parseFloat(orderData.total_amount);
        }
        setOrder(orderData);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [orderId]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 dark:border-primary-400"></div>
      </div>
    );
  }
  
  if (error || !order) {
    return (
      <div className="text-center py-12 dark:text-gray-300">
        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Error</h2>
        <p className="mb-6">{error || 'Order not found.'}</p>
        <button onClick={() => window.history.back()} className="btn-secondary dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">Go Back</button>
      </div>
    );
  }
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  return (
    <div className="max-w-3xl mx-auto py-8 px-4 dark:bg-gray-800">
      <div className="text-center bg-green-100 rounded-lg p-6 mb-8 dark:bg-green-700/30">
        <svg className="w-16 h-16 text-green-500 dark:text-green-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <h1 className="text-3xl font-bold text-green-700 dark:text-green-300 mb-2">Order Confirmed!</h1>
        <p className="text-green-600 dark:text-green-400">Thank you for your purchase. Your order #<span className="font-semibold">{order.id}</span> has been placed.</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8 dark:bg-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 border-b pb-3 dark:border-gray-600">Order Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Order ID</h3>
            <p className="text-gray-800 dark:text-white font-semibold">{order.id}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Order Date</h3>
            <p className="text-gray-800 dark:text-white font-semibold">{formatDate(order.created_at)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Order Status</h3>
            <p className="text-gray-800 dark:text-white font-semibold capitalize">{order.status}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Order Total</h3>
            <p className="text-gray-800 dark:text-white font-semibold">€{order.total_amount.toFixed(2)}</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Shipping Address</h3>
          <address className="not-italic text-gray-600 dark:text-gray-300">
            {order.shipping_address.fullName}<br />
            {order.shipping_address.street}<br />
            {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postalCode}<br />
            {order.shipping_address.country}
          </address>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Items Ordered</h3>
          <ul className="space-y-3">
            {order.items.map((item: any) => (
              <li key={item.id} className="flex justify-between items-start p-3 bg-gray-50 dark:bg-gray-600 rounded-md">
                <div className="flex-grow">
                  <p className="font-medium text-gray-800 dark:text-white">{item.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Quantity: {item.quantity}</p>
                </div>
                <p className="text-gray-800 dark:text-white font-semibold">€{(item.price * item.quantity).toFixed(2)}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="text-center">
        <button onClick={() => window.location.href = '/products'} className="btn-primary mr-4">Continue Shopping</button>
        <button onClick={() => window.location.href = '/orders'} className="btn-secondary dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">View My Orders</button>
      </div>
    </div>
  );
};

export default OrderConfirmation;