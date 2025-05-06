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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  if (error || !order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p className="mb-6">{error || 'Failed to load order details'}</p>
        <Link
          to="/"
          className="px-6 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
        >
          Return to Home
        </Link>
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
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="text-center bg-green-100 rounded-lg p-6 mb-8">
        <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Thank You!</h1>
        <p className="text-lg text-gray-600 mb-0">Your order has been placed successfully.</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Order #{order.id}</h2>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium capitalize">
            {order.status}
          </span>
        </div>
        
        <p className="text-gray-500 mb-4">
          Placed on {formatDate(order.created_at)}
        </p>
        
        <h3 className="text-lg font-semibold mb-4 mt-6">Order Items</h3>
        <div className="space-y-4 mb-6">
          {order.items.map((item: any, index: number) => (
            <div key={index} className="flex justify-between items-center border-b pb-4">
              <div className="flex items-center">
                <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-md">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-4">
                  <h4 className="text-base font-medium text-gray-900">{item.name}</h4>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-900">
                €{(Number(item.price) * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
        
        <div className="border-t pt-4 mb-6">
          <div className="flex justify-between items-center">
            <p className="text-base font-medium">Total</p>
            <p className="text-lg font-bold text-primary-600">
              €{Number(order.total_amount).toFixed(2)}
            </p>
          </div>
        </div>
        
        {order.shipping_address && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>
            <div className="text-gray-700">
              <p>{order.shipping_address.fullName}</p>
              <p>{order.shipping_address.street}</p>
              <p>
                {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postalCode}
              </p>
              <p>{order.shipping_address.country}</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="text-center">
        <Link
          to="/products"
          className="px-6 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;