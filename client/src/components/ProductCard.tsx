import React from 'react';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';
import { handleImageError } from '../utils/imageUtils';
import { ShoppingBagIcon, SparklesIcon, TagIcon, CubeTransparentIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/outline';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const price = Number(product.price);

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-700/50 border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl dark:hover:shadow-primary-500/30 hover:scale-[1.02]">
      <div className="relative w-full h-60 bg-gray-100 dark:bg-gray-700 overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
          onError={(e) => handleImageError(e, 'product')}
        />
        <div className="absolute top-0 right-0 m-3 bg-red-500 dark:bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-md">
          ${price.toFixed(2)}
        </div>
        {product.stock === 0 && (
          <div className="absolute bottom-0 left-0 right-0 bg-red-500/80 dark:bg-red-700/80 text-white text-center py-2 text-sm font-medium">
            Out of Stock
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
            {product.name}
        </h3>

        <div className="flex-grow space-y-3 mb-5">
            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                {product.description}
            </p>

            <div className="space-y-1.5 text-xs text-gray-500 dark:text-gray-400">
              {product.material && (
                <div className="flex items-center">
                  <CubeTransparentIcon className="w-4 h-4 mr-2 text-primary-500 dark:text-primary-400" />
                  <span>Material: {product.material}</span>
                </div>
              )}
              {product.dimensions && (
                <div className="flex items-center">
                  <ArrowsPointingOutIcon className="w-4 h-4 mr-2 text-primary-500 dark:text-primary-400" />
                  <span>Size: {product.dimensions}</span>
                </div>
              )}
            </div>
        </div>

        <div className="pt-5 border-t border-gray-200 dark:border-gray-700 space-y-3">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                {product.stock > 0 ? (
                    <>
                        <TagIcon className="w-4 h-4 mr-1.5 text-green-500" />
                        <span>{product.stock} in stock</span>
                    </>
                ) : (
                    <span className="text-red-500 dark:text-red-400">Currently unavailable</span>
                )}
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <Link
                to={`/personalize/${product.id}`}
                className={`flex items-center justify-center gap-2 whitespace-nowrap text-sm px-4 py-2 rounded-lg shadow-md transition-colors duration-150 ${product.stock === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-purple-500 hover:bg-purple-600 text-white'}`}
                aria-disabled={product.stock === 0}
                onClick={(e) => product.stock === 0 && e.preventDefault()} // Prevent navigation if out of stock
              >
                <SparklesIcon className="w-5 h-5"/> Personalize
              </Link>
              <button
                onClick={() => addItem(product)}
                className={`flex items-center justify-center gap-2 whitespace-nowrap text-sm px-4 py-2 rounded-lg shadow-md transition-colors duration-150 ${product.stock === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                disabled={product.stock === 0}
              >
                <ShoppingBagIcon className="w-5 h-5"/> {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;