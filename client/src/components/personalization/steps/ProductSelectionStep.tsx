import React from 'react';
import { usePersonalization } from '../../../contexts/PersonalizationContext';
import { useProducts } from '../../../hooks/useProducts';
import { Product } from '../../../types';
import { handleImageError } from '../../../utils/imageUtils';

const ProductSelectionStep: React.FC = () => {
  const { state, setProduct, nextStep } = usePersonalization();
  const { products, loading, error } = useProducts();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500 dark:border-primary-400"></div>
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

  const handleProductSelect = (product: Product) => {
    setProduct(product);
    nextStep();
  };

  return (
    <div className="dark:text-gray-300">
      <h3 className="text-xl font-semibold mb-6 dark:text-white">Select a Product to Personalize</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div 
            key={product.id}
            className={`
              border rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-lg dark:border-gray-600 dark:hover:shadow-primary-500/30
              ${state.product?.id === product.id ? 'ring-2 ring-primary-500 dark:ring-primary-400' : 'dark:bg-gray-700'}
            `}
            onClick={() => handleProductSelect(product)}
          >
            <div className="h-48 overflow-hidden relative">
              <img 
                src={product.image_url} 
                alt={product.name} 
                className="w-full h-full object-cover"
                onError={(e) => handleImageError(e, 'product')}
              />
            </div>
            <div className="p-4 dark:bg-gray-700">
              <h4 className="font-semibold text-lg mb-1 dark:text-white">{product.name}</h4>
              <p className="text-sm text-gray-600 line-clamp-2 dark:text-gray-400">{product.description}</p>
              <div className="mt-2 flex justify-between items-center">
                <span className="font-bold text-primary-600 dark:text-primary-400">${Number(product.price).toFixed(2)}</span>
                {product.stock > 0 ? (
                  <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full dark:text-green-300 dark:bg-green-800">
                    In Stock
                  </span>
                ) : (
                  <span className="text-xs text-red-700 bg-red-100 px-2 py-1 rounded-full dark:text-red-300 dark:bg-red-800">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSelectionStep;