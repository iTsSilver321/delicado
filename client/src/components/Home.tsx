import React from 'react';
import { Link } from 'react-router-dom';
import ProductGrid from './ProductGrid';
import { useProducts } from '../hooks/useProducts';
import { FiChevronRight, FiShoppingCart, FiGift, FiShield, FiFeather } from 'react-icons/fi';

const Home: React.FC = () => {
  const { products, loading, error } = useProducts();

  const featuredProducts = products.slice(0, 4);

  return (
    <div className="animate-fadeIn space-y-16 md:space-y-24 pb-16">
      {/* Hero Section - Modernized & Enhanced */}
      <section className="relative text-white py-28 md:py-40 xl:py-48 group overflow-hidden">
        {/* Background Image/Video Placeholder - Replace with actual media */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-110"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1582582622787-43c939500406?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }} // Example image
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-teal-900/80 via-teal-700/60 to-black/30"></div> {/* Changed gradient to a teal base for section color */}

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-shadow-lg">
            Crafted for <span className="text-teal-300">Your Comfort</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl opacity-90 max-w-3xl mx-auto mb-10 text-shadow-md">
            Experience the art of fine living with Delicado. Premium home textiles designed to elevate your everyday moments.
          </p>
          <Link
            to="/products"
            className="inline-block bg-teal-500 hover:bg-teal-600 text-white font-semibold text-lg sm:text-xl px-10 py-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-teal-300 focus:ring-opacity-50 group"
          >
            Discover the Collection <FiChevronRight className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0">
            Featured Collection
          </h2>
          <Link
            to="/products"
            className="btn-secondary text-sm group"
          >
            View All Products <FiChevronRight className="inline-block ml-1 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-600 bg-red-50 dark:bg-red-900 dark:text-red-300 p-6 rounded-lg">
            <p className="text-xl font-semibold">Oops! Something went wrong.</p>
            <p>{error}</p>
          </div>
        ) : featuredProducts.length > 0 ? (
          <ProductGrid products={featuredProducts} />
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p className="text-xl">No featured products available at the moment.</p>
            <p>Please check back later!</p>
          </div>
        )}
      </section>

      {/* Why Choose Delicado Section - Modernized */}
      <section className="bg-gray-50 dark:bg-gray-800 py-16 md:py-24 rounded-3xl mx-2 sm:mx-4 shadow-inner">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12 md:mb-16">
            Why Choose Delicado?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <div className="flex flex-col items-center text-center p-6 md:p-8 bg-white dark:bg-gray-700 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
              <div className="p-4 bg-primary-100 dark:bg-primary-700 rounded-full mb-5 text-primary-500 dark:text-primary-300">
                <FiFeather size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Premium Quality</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                Indulge in meticulously selected materials, ensuring lasting comfort and sophisticated style for your home.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 md:p-8 bg-white dark:bg-gray-700 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
              <div className="p-4 bg-green-100 dark:bg-green-700 rounded-full mb-5 text-green-500 dark:text-green-300">
                <FiShield size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Eco-Conscious</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                Committed to sustainability through eco-friendly production, packaging, and ethical sourcing.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 md:p-8 bg-white dark:bg-gray-700 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
              <div className="p-4 bg-secondary-100 dark:bg-secondary-700 rounded-full mb-5 text-secondary-500 dark:text-secondary-300">
                <FiGift size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Exceptional Care</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                Our dedicated team is here to ensure your complete satisfaction, offering personalized support.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;