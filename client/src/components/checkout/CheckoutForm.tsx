import React, { useState, useEffect } from 'react';
import { useStripe as useStripeJs, useElements, CardElement } from '@stripe/react-stripe-js';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { paymentService, ShippingAddress, ShippingInfo } from '../../services/paymentService';

interface CheckoutFormProps {
  onSuccess: (orderId: number) => void;
  onCancel: () => void;
}

const shippingOptions = [
  { name: 'Standard', cost: 5 },
  { name: 'Express', cost: 15 }
];

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSuccess, onCancel }) => {
  // New payment method state
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');
  const stripe = useStripeJs();
  const elements = useElements();
  const { state: cartState, clearCart } = useCart();
  const { user } = useAuth();
  
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState('');
  const [orderId, setOrderId] = useState<number | null>(null);
  
  // Shipping information state
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: user ? `${user.first_name} ${user.last_name}` : '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  });

  // Selected saved address index (-1 for new)
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<string>('');

  // Shipping method state
  const [shippingMethod, setShippingMethod] = useState(shippingOptions[0].name);
  const [shippingCost, setShippingCost] = useState(shippingOptions[0].cost);
  
  // Update shipping address name when user changes
  useEffect(() => {
    if (user) {
      setShippingAddress(prev => ({
        ...prev,
        fullName: `${user.first_name} ${user.last_name}`
      }));
    }
  }, [user]);

  const handleSavedAddressSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const idx = e.target.value;
    setSelectedAddressIndex(idx);
    if (idx === '' || idx === '-1') {
      // New address: clear fields except name
      setShippingAddress({
        fullName: user ? `${user.first_name} ${user.last_name}` : '',
        street: '', city: '', state: '', postalCode: '', country: ''
      });
    } else {
      const addr = user?.shipping_addresses?.[Number(idx)]!;
      setShippingAddress(addr);
    }
  };
  
  const createPaymentIntent = async (): Promise<{clientSecret: string; orderId: number;} | null> => {
    try {
      setProcessing(true);
      const response = await paymentService.createPaymentIntent(
        cartState.items,
        user?.id,
        { ...shippingAddress, shippingMethod, shippingCost } as ShippingInfo
      );
      setClientSecret(response.clientSecret);
      setOrderId(response.orderId);
      return { clientSecret: response.clientSecret, orderId: response.orderId };
    } catch (err) {
      console.error('Error creating payment intent:', err);
      setError('Failed to initialize payment. Please try again.');
      return null;
    } finally {
      setProcessing(false);
    }
  };
  
  const handleChange = (event: any) => {
    // Listen for changes in the CardElement
    // and display any errors as the customer types their card details
    setDisabled(event.empty);
    setError(event.error ? event.error.message : '');
  };
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // Validate shipping address
    if (!validateShippingAddress()) {
      setError('Please fill in all shipping information fields');
      return;
    }
    
    setProcessing(true);

    if (paymentMethod === 'cash') {
      try {
        // Create cash order
        const response = await paymentService.createCashOrder(
          cartState.items,
          user?.id,
          { ...shippingAddress, shippingMethod, shippingCost } as ShippingInfo
        );
        clearCart();
        onSuccess(response.orderId);
      } catch (err: any) {
        console.error('Error creating cash order:', err.response || err);
        const msg = err.response?.data?.error || 'Failed to place cash order. Please try again.';
        setError(msg);
      } finally {
        setProcessing(false);
      }
      return;
    }

    // Create PaymentIntent on submit if not already created and capture secret
    let secret = clientSecret;
    let oid = orderId;
    if (!secret) {
      const resp = await createPaymentIntent();
      if (!resp) {
        setProcessing(false);
        return;
      }
      secret = resp.clientSecret;
      oid = resp.orderId;
    }

    // Stripe.js hasn't loaded yet
    if (!stripe || !elements) {
      setProcessing(false);
      return;
    }
    
    const cardElement = elements.getElement(CardElement);
    
    if (!cardElement) {
      setError('Card element not found');
      setProcessing(false);
      return;
    }
    
    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(secret!, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: shippingAddress.fullName,
            address: {
              line1: shippingAddress.street,
              city: shippingAddress.city,
              state: shippingAddress.state,
              postal_code: shippingAddress.postalCode,
              country: shippingAddress.country
            }
          }
        }
      });
      
      if (error) {
        setError(`Payment failed: ${error.message}`);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        setSucceeded(true);
        setError(null);
        // Finalize order: update status and inventory in backend
        if (oid) {
          await paymentService.finalizeOrder(oid);
        }
        clearCart();
        onSuccess(oid!);
      }
    } catch (err: any) {
      console.error('Error confirming payment:', err.response || err);
      const msg2 = err.response?.data?.error || 'An unexpected error occurred. Please try again.';
      setError(msg2);
    } finally {
      setProcessing(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const validateShippingAddress = () => {
    return Object.values(shippingAddress).every(value => value.trim() !== '');
  };
  
  const cardElementOptions = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: 'Arial, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4"
        }
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a"
      }
    },
  };
  
  return (
    <div className="form-card space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h2>

      {/* Payment Method Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
        <div className="flex items-center space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={() => setPaymentMethod('card')}
              className="form-radio"
            />
            <span className="ml-2">Credit/Debit Card</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="paymentMethod"
              value="cash"
              checked={paymentMethod === 'cash'}
              onChange={() => setPaymentMethod('cash')}
              className="form-radio"
            />
            <span className="ml-2">Cash on Delivery</span>
          </label>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {paymentMethod === 'card' && succeeded ? (
        <div className="text-center py-6">
          <div className="text-green-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Payment Successful!</h3>
          <p className="mb-4">Your order has been placed successfully.</p>
          <button 
            onClick={() => onSuccess(orderId!)}
            className="bg-primary-500 text-white px-6 py-2 rounded hover:bg-primary-600 transition-colors"
          >
            View Your Order
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Saved Address Selector */}
          {user?.shipping_addresses?.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Saved Addresses</label>
              <select
                value={selectedAddressIndex}
                onChange={handleSavedAddressSelect}
                className="input-field"
              >
                <option value="">Choose address...</option>
                <option value="-1">Use New Address</option>
                {user?.shipping_addresses?.map((addr: any, idx: number) => (
                  <option key={idx} value={String(idx)}>
                    {addr.fullName}, {addr.street}, {addr.city}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold mb-4">Shipping Information</h3>
            <div className="grid grid-cols-1 gap-4">
              {/* Shipping fields below use shippingAddress state populated above */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={shippingAddress.fullName}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                  disabled={selectedAddressIndex !== '' && selectedAddressIndex !== '-1'}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  name="street"
                  value={shippingAddress.street}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                  disabled={selectedAddressIndex !== '' && selectedAddressIndex !== '-1'}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                    disabled={selectedAddressIndex !== '' && selectedAddressIndex !== '-1'}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State/Province
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={shippingAddress.state}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                    disabled={selectedAddressIndex !== '' && selectedAddressIndex !== '-1'}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={shippingAddress.postalCode}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                    disabled={selectedAddressIndex !== '' && selectedAddressIndex !== '-1'}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={shippingAddress.country}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                    disabled={selectedAddressIndex !== '' && selectedAddressIndex !== '-1'}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {paymentMethod === 'card' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Information
              </label>
              <div className="border border-gray-300 p-3 rounded mb-4">
                <CardElement options={cardElementOptions} onChange={handleChange} />
              </div>
              <div className="text-sm text-gray-500 mb-4">
                Test card: 4242 4242 4242 4242 | Exp: Any future date | CVC: Any 3 digits
              </div>
            </div>
          )}
          
          <div className="pt-4 border-t border-gray-200 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Subtotal:</span>
              <span>€{cartState.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Shipping:</span>
              <span>€{shippingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-2xl font-bold text-primary-600">
                €{(cartState.total + shippingCost).toFixed(2)}
              </span>
            </div>
            
            <div className="flex justify-between space-x-4">
              <button
                type="button"
                onClick={onCancel}
                className="btn-secondary"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={processing || succeeded || (paymentMethod === 'card' && disabled)}
                className={`btn-primary w-2/3 ${
                  (processing || (paymentMethod === 'card' && disabled)) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {processing ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : paymentMethod === 'cash' ? (
                  'Place Order'
                ) : (
                  'Pay Now'
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default CheckoutForm;