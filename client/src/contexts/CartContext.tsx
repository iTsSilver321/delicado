import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Product, CartItem } from '../types';

interface CartState {
  items: CartItem[];
  total: number; // Keep total calculation here
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartState };

interface CartContextType {
  state: CartState;
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

const initialState: CartState = {
  items: [],
  total: 0,
};

const CartContext = createContext<CartContextType | undefined>(undefined);

// Safe storage access functions
const safeGetItem = (key: string): string | null => {
  try {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem(key);
  } catch (error) {
    console.warn('Failed to get item from storage:', error);
    return null;
  }
};

const safeSetItem = (key: string, value: string): void => {
  try {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(key, value);
  } catch (error) {
    console.warn('Failed to save item to storage:', error);
  }
};

const calculateTotal = (items: CartItem[]): number => {
  return Number(items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0).toFixed(2));
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  let newItems: CartItem[];

  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(item => item.id === action.payload.id);
      if (existingItemIndex > -1) {
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newItems = [...state.items, { ...action.payload, quantity: 1 }];
      }
      break;
    }
    case 'REMOVE_ITEM': {
      newItems = state.items.filter(item => item.id !== action.payload);
      break;
    }
    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      if (quantity === 0) {
        // Delegate to REMOVE_ITEM logic
        newItems = state.items.filter(item => item.id !== id);
      } else {
        newItems = state.items.map(item =>
          item.id === id ? { ...item, quantity } : item
        );
      }
      break;
    }
    case 'CLEAR_CART':
      newItems = [];
      break;
    case 'LOAD_CART':
      // Ensure loaded items have correct structure and price is number
      const loadedItems = action.payload.items.map(item => ({
          ...item,
          price: Number(item.price),
          quantity: Number(item.quantity) || 1 // Ensure quantity is valid
      }));
      return {
          items: loadedItems,
          total: calculateTotal(loadedItems)
      };
    default:
      return state;
  }

  return {
    items: newItems,
    total: calculateTotal(newItems),
  };
};


const STORAGE_KEY = 'delicado_cart';

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [isStorageReady, setIsStorageReady] = React.useState(false);

  // Initialize storage and load cart
  useEffect(() => {
    const initializeCart = () => {
      const savedCart = safeGetItem(STORAGE_KEY);
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          // Validate loaded state structure before dispatching
          if (parsedCart && Array.isArray(parsedCart.items)) {
             dispatch({ type: 'LOAD_CART', payload: parsedCart });
          } else {
              console.warn('Invalid cart data found in storage.');
          }
        } catch (error) {
          console.warn('Failed to parse cart data:', error);
        }
      }
      setIsStorageReady(true);
    };

    // Ensure this runs only client-side
    if (typeof window !== 'undefined') {
        if (document.readyState === 'complete') {
            initializeCart();
        } else {
            window.addEventListener('load', initializeCart);
            return () => window.removeEventListener('load', initializeCart);
        }
    } else {
        // Handle server-side rendering case if applicable (maybe set storageReady immediately)
        setIsStorageReady(true);
    }

  }, []);

  // Save cart when it changes
  useEffect(() => {
    if (isStorageReady && typeof window !== 'undefined') {
      safeSetItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isStorageReady]);

  const addItem = (product: Product) => {
    dispatch({ type: 'ADD_ITEM', payload: { ...product, price: Number(product.price) } }); // Ensure price is number
  };

  const removeItem = (productId: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 0) return; // Prevent negative quantity
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider
      value={{ state, addItem, removeItem, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};