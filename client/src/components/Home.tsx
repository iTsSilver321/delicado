import React from 'react';
import { Link } from 'react-router-dom';
import ProductGrid from './ProductGrid';
import { useProducts } from '../hooks/useProducts';

const Home: React.FC = () => {
  const { products, loading, error } = useProducts();

  return (
    <div className="space-y-12">
      <section className="bg-gradient-to-r from-primary-500 to-secondary-500 py-20 rounded-xl mx-4 sm:mx-0">
        <div className="max-w-4xl mx-auto text-center text-white space-y-4 px-4">
          <h1 className="text-5xl font-extrabold tracking-tight">Welcome to Delicado</h1>
          <p className="text-lg opacity-90">
            Discover our premium home textiles designed for ultimate comfort and style.
          </p>
          <Link
            to="/products"
            className="btn-primary text-lg px-6 py-3 mt-4 inline-block"
          >
            Shop Now
          </Link>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-900">Featured Products</h2>
          <Link
            to="/products"
            className="btn-gradient-blue-green text-sm"
          >
            View All Products
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">
            {error}
          </div>
        ) : (
          <ProductGrid products={products.slice(0, 6)} /> // Displaying first 6 as featured
        )}
      </section>

      <section className="bg-primary-50 rounded-2xl p-8 space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900 text-center">
          Why Choose Delicado?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-3">
            <div className="text-primary-500 text-4xl">✨</div>
            <h3 className="font-semibold text-gray-900">Premium Quality</h3>
            <p className="text-gray-600">
              Carefully selected materials for lasting comfort
            </p>
          </div>
          <div className="text-center space-y-3">
            <div className="text-primary-500 text-4xl">🌿</div>
            <h3 className="font-semibold text-gray-900">Eco-Friendly</h3>
            <p className="text-gray-600">
              Sustainable production and packaging
            </p>
          </div>
          <div className="text-center space-y-3">
            <div className="text-primary-500 text-4xl">💝</div>
            <h3 className="font-semibold text-gray-900">Customer Care</h3>
            <p className="text-gray-600">
              Dedicated support for your satisfaction
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;