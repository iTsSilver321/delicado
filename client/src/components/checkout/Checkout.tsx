import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import CheckoutForm from './CheckoutForm';

const Checkout: React.FC = () => {
  const { state: cartState } = useCart();
  const navigate = useNavigate();
  
  if (cartState.items.length === 0) {
    return (
      <div className="text-center py-12 dark:text-gray-300">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Your cart is empty</h2>
        <p className="mb-6">Add some products to your cart before checkout.</p>
        <button
          onClick={() => navigate('/products')}
          className="btn-primary"
        >
          Browse Products
        </button>
      </div>
    );
  }
  
  const handleCheckoutSuccess = (orderId: number) => {
    navigate(`/order-confirmation/${orderId}`);
  };
  
  const handleCancel = () => {
    navigate('/');
  };
  
  return (
    <div className="max-w-3xl mx-auto py-8 px-4 dark:bg-gray-800">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 dark:text-white">Checkout</h1>
      
      <div className="form-card mb-8 dark:bg-gray-700 dark:border-gray-600">  
        <h2 className="text-xl font-bold mb-4 dark:text-white">Order Summary</h2>
        <div className="space-y-4">
          {cartState.items.map((item) => (
            <div key={item.id} className="flex justify-between items-center border-b pb-4 dark:border-gray-600">
              <div className="flex items-center">
                <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-md">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-4">
                  <h3 className="text-base font-medium text-gray-900 dark:text-white">{item.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                €{(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center border-t pt-4 mt-4 dark:border-gray-600">
          <p className="text-base font-medium dark:text-white">Total</p>
          <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
            €{cartState.total.toFixed(2)}
          </p>
        </div>
      </div>
      
      <CheckoutForm 
        onSuccess={handleCheckoutSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default Checkout;