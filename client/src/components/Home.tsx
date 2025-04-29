import React from 'react';
import { Link } from 'react-router-dom';
import ProductGrid from './ProductGrid';
import { useProducts } from '../hooks/useProducts';

const Home: React.FC = () => {
  const { products, loading, error } = useProducts();

  return (
    <div className="space-y-12">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Welcome to Delicado</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover our collection of premium home textiles designed for your comfort
        </p>
      </section>

      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-900">Featured Products</h2>
          <Link
            to="/products"
            className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            View All Products →
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