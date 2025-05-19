import React from 'react';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';
import { handleImageError } from '../utils/imageUtils';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const price = Number(product.price);

  return (
    <div className="group bg-white dark:bg-accent-800 rounded-lg shadow-md dark:shadow-accent-700/50 border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden transform transition duration-300 hover:shadow-lg dark:hover:shadow-accent-600/60 hover:scale-105">
      {/* Image container with fixed height */}
      <div className="relative w-full h-56 bg-zinc-100 dark:bg-accent-700">
        <img
          src={product.image_url}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => handleImageError(e, 'product')}
        />
      </div>
      {/* Content container */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold mb-2 text-zinc-900 dark:text-accent-100 line-clamp-2 min-h-[2.8em]">
            {product.name}
        </h3>
         {/* Let the description and details take up available space */}
        <div className="flex-grow space-y-2 mb-4">
            <p className="text-zinc-600 dark:text-accent-300 text-sm line-clamp-3">
                {product.description}
            </p>
             {/* Details section */}
            <div className="space-y-1">
              {product.material && (
                <p className="text-xs text-zinc-500 dark:text-accent-400">Material: {product.material}</p>
              )}
              {product.dimensions && (
                <p className="text-xs text-zinc-500 dark:text-accent-400">Size: {product.dimensions}</p>
              )}
            </div>
        </div>
        {/* Footer section */}
        <div className="pt-4 border-t border-zinc-100 dark:border-accent-700 space-y-2">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <span className="text-lg font-bold text-primary-500 dark:text-primary-400">
              ${price.toFixed(2)}
            </span>
            <div className="flex flex-wrap justify-end gap-2"> {/* Allow buttons to wrap and align to the end */}
              <Link
                to={`/personalize/${product.id}`}
                className="btn-personalize whitespace-nowrap text-sm"
                aria-disabled={product.stock === 0}
              >
                Personalize
              </Link>
              <button
                onClick={() => addItem(product)}
                className="btn-cart whitespace-nowrap"
                disabled={product.stock === 0}
              >
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </div>
          <div className="mt-2 text-sm text-zinc-500 dark:text-accent-400">
            {product.stock > 0 ? `${product.stock} in stock` : 'Currently unavailable'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;