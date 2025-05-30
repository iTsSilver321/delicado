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
import AdminDashboard from './components/admin/AdminDashboard';
import ProductsAdmin from './components/admin/ProductsAdmin';
import ProductForm from './components/admin/ProductForm';
import DesignsAdmin from './components/admin/DesignsAdmin';
import DesignForm from './components/admin/DesignForm';
import OrdersAdmin from './components/admin/OrdersAdmin';
import UsersAdmin from './components/admin/UsersAdmin';
import ContentAdmin from './components/admin/ContentAdmin';
import ReportsAdmin from './components/admin/ReportsAdmin';

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
      <div className="text-center text-red-500 p-4 bg-red-100 rounded-md dark:bg-red-800 dark:text-red-300">
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
          className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 w-full md:w-1/3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-colors"
        />
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 w-full md:w-1/4 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-colors"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select
          value={sortOption}
          onChange={e => setSortOption(e.target.value)}
          className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 w-full md:w-1/4 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-colors"
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
                      <h2 className="text-3xl font-bold text-gray-900 mb-6 dark:text-white">
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

                  {/* Admin routes */}
                  <Route path="/admin/*" element={
                    <ProtectedRoute requireAdmin>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }>
                    {/* Products management */}
                    <Route index element={<ProductsAdmin />} />
                    <Route path="products" element={<ProductsAdmin />} />
                    <Route path="products/create" element={<ProductForm />} />
                    <Route path="products/:id/edit" element={<ProductForm />} />
                    {/* Design templates management */}
                    <Route path="designs" element={<DesignsAdmin />} />
                    <Route path="designs/create" element={<DesignForm />} />
                    <Route path="designs/:id/edit" element={<DesignForm />} />
                    {/* Other admin sections */}
                    <Route path="orders" element={<OrdersAdmin />} />
                    <Route path="users" element={<UsersAdmin />} />
                    <Route path="content" element={<ContentAdmin />} />
                    <Route path="reports" element={<ReportsAdmin />} />
                  </Route>
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