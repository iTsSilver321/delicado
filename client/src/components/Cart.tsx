import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { ShoppingCartIcon, TrashIcon } from '@heroicons/react/24/outline'; // Example using heroicons

interface CartProps {
  closeCart?: () => void; // Optional prop to close the cart
}

const Cart: React.FC<CartProps> = ({ closeCart }) => {
  const { state: cartState, removeItem, updateQuantity } = useCart();
  const navigate = useNavigate();

  const total = cartState.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="bg-white dark:bg-gray-900 shadow-xl rounded-lg p-6 md:p-8 max-w-2xl mx-auto my-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-white flex items-center">
          <ShoppingCartIcon className="w-8 h-8 mr-3 text-primary-500 dark:text-primary-400" />
          Your Cart
        </h2>
        {/* Removed Continue Shopping button as cart is a sidebar */}
      </div>

      {cartState.items.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingCartIcon className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-xl text-gray-500 dark:text-gray-400">Your cart is currently empty.</p>
          <p className="text-gray-400 dark:text-gray-500 mt-2">Add some amazing products to get started!</p>
        </div>
      ) : (
        <>
          <div className="space-y-6 mb-8 max-h-[calc(3*(theme(spacing.20)+theme(spacing.4)+theme(borderWidth.DEFAULT)*2))] overflow-y-auto pr-2">
            {cartState.items.map((item) => (
              <div
                key={item.id}
                className="flex items-start sm:items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-start sm:items-center space-x-4">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-md border border-gray-200 dark:border-gray-700"
                  />
                  <div className="flex-grow">
                    <h3 className="font-medium text-lg text-gray-800 dark:text-white">{item.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Unit Price: €{item.price.toFixed(2)}</p>
                     <p className="sm:hidden text-sm text-gray-600 dark:text-gray-300 mt-1">
                      Total: €{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} // Prevent quantity from going below 1
                      className="p-1.5 rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
                      </svg>
                    </button>
                    <span className="w-10 text-center font-medium text-gray-700 dark:text-gray-200">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1.5 rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                      </svg>
                    </button>
                  </div>
                  <p className="hidden sm:block text-md font-semibold text-gray-700 dark:text-gray-200 w-24 text-right">
                    €{(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30"
                    aria-label="Remove item"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg text-gray-600 dark:text-gray-300">Subtotal:</span>
              <span className="text-lg font-medium text-gray-800 dark:text-white">
                €{total.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Shipping:</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">Calculated at checkout</span>
            </div>
             <div className="flex justify-between items-center mb-6 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <span className="text-xl font-semibold text-gray-800 dark:text-white">Order Total:</span>
              <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                €{total.toFixed(2)}
              </span>
            </div>
            <button 
              onClick={() => {
                navigate('/checkout');
                if (closeCart) {
                  closeCart(); // Close the cart if the function is provided
                }
              }}
              className="w-full px-6 py-3.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-300 ease-in-out font-semibold text-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 dark:bg-green-600 dark:hover:bg-green-700"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;