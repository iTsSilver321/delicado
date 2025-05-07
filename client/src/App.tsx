import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ProductGrid from './components/ProductGrid';
import Home from './components/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Profile from './components/auth/Profile';
import Orders from './components/auth/Orders';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useProducts } from './hooks/useProducts';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import { PersonalizationProvider } from './contexts/PersonalizationContext';
import { StripeProvider } from './contexts/StripeContext';
import PersonalizationFlow from './components/personalization/PersonalizationFlow';
import Checkout from './components/checkout/Checkout';
import OrderConfirmation from './components/checkout/OrderConfirmation';

// Component to display all products on the /products page
const AllProductsSection: React.FC = () => {
  const { products, loading, error } = useProducts();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        {/* Simple spinner */}
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4 bg-red-100 rounded-md">
        Error loading products: {error}
      </div>
    );
  }

  return <ProductGrid products={products} />;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <StripeProvider>
            <PersonalizationProvider>
              <MainLayout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={
                    <div className="space-y-8">
                      <h2 className="text-3xl font-bold text-gray-900 mb-6">
                        Our Products
                      </h2>
                      <AllProductsSection />
                    </div>
                  } />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                  <Route path="/orders" element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  } />
                  {/* New route for personalization flow */}
                  <Route path="/personalize" element={<PersonalizationFlow />} />
                  <Route path="/personalize/:productId" element={<PersonalizationFlow />} />
                  
                  {/* Checkout routes */}
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
                </Routes>
              </MainLayout>
            </PersonalizationProvider>
          </StripeProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;