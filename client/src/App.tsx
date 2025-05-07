import React, { useState, useMemo } from 'react';
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
import DesignLibrary from './components/DesignLibrary';

// Component to display all products on the /products page
const AllProductsSection: React.FC = () => {
  const { products, loading, error } = useProducts();
  // New states for search, category filter, and sort options
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortOption, setSortOption] = useState('newest');

  // Derive list of categories from products
  const categories = useMemo(() => ['All', ...Array.from(new Set(products.map(p => p.category)))], [products]);

  // Apply filters and sorting to products
  const filteredProducts = useMemo(() => {
    let result = products;
    if (categoryFilter !== 'All') {
      result = result.filter(p => p.category === categoryFilter);
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term));
    }
    if (sortOption === 'price-asc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-desc') {
      result = [...result].sort((a, b) => b.price - a.price);
    } else {
      // newest
      result = [...result].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    return result;
  }, [products, categoryFilter, searchTerm, sortOption]);

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

  return (
    <div>
      {/* Controls for search, category filter, and sorting */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-4 space-y-2 md:space-y-0">
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search products..."
          className="border rounded-md px-3 py-2 w-full md:w-1/3"
        />
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="border rounded-md px-3 py-2 w-full md:w-1/4"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select
          value={sortOption}
          onChange={e => setSortOption(e.target.value)}
          className="border rounded-md px-3 py-2 w-full md:w-1/4"
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>
      <ProductGrid products={filteredProducts} />
    </div>
  );
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
                  <Route path="/design-library" element={<DesignLibrary />} />
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