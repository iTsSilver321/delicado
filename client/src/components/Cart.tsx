import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const Cart: React.FC = () => {
  const { state: cartState, removeItem, updateQuantity } = useCart();
  const navigate = useNavigate();

  const total = cartState.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 dark:bg-gray-800">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 dark:text-white">Shopping Cart</h2>
      {cartState.items.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">Your cart is empty</p>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {cartState.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg dark:bg-gray-700"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{item.name}</h3>
                    <p className="text-gray-500 dark:text-gray-400">€{item.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-200"
                    >
                      -
                    </button>
                    <span className="w-8 text-center dark:text-gray-200">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-200"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700 transition-colors dark:text-red-400 dark:hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 dark:border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-semibold dark:text-gray-200">Total:</span>
              <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                €{total.toFixed(2)}
              </span>
            </div>
            <button 
              onClick={() => navigate('/checkout')}
              className="w-full px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium dark:bg-primary-600 dark:hover:bg-primary-700"
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;