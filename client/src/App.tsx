import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ProductGrid from './components/ProductGrid';
import Home from './components/Home';
import { useProducts } from './hooks/useProducts';
import { CartProvider } from './contexts/CartContext';

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
      <CartProvider>
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
            {/* Add other routes here (e.g., product detail, checkout) */}
          </Routes>
        </MainLayout>
      </CartProvider>
    </BrowserRouter>
  );
};

export default App;