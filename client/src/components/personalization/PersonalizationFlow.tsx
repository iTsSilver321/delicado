import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePersonalization } from '../../contexts/PersonalizationContext';
import { useProducts } from '../../hooks/useProducts';
import ProductSelectionStep from './steps/ProductSelectionStep';
import TemplateSelectionStep from './steps/TemplateSelectionStep';
import TextCustomizationStep from './steps/TextCustomizationStep';
import PreviewStep from './steps/PreviewStep';

const PersonalizationFlow: React.FC = () => {
  const { productId } = useParams<{ productId?: string }>();
  const { state, setProduct, resetPersonalization } = usePersonalization();
  const { products, loading, error } = useProducts();
  const navigate = useNavigate();
  
  // Add a ref to track if we've already set the product for this productId
  const productSetRef = useRef<string | null>(null);

  // If a productId is provided in the URL, select that product
  useEffect(() => {
    // Only set the product if we haven't set it yet for this productId
    if (productId && products.length > 0 && productSetRef.current !== productId) {
      const selectedProduct = products.find(product => product.id === Number(productId));
      if (selectedProduct) {
        // Track that we've set the product for this productId
        productSetRef.current = productId;
        setProduct(selectedProduct);
      } else {
        // Product not found, redirect to products page
        navigate('/products');
      }
    }
  }, [productId, products, setProduct, navigate]);

  // Show loading state while fetching products
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 dark:border-primary-400"></div>
      </div>
    );
  }

  // Show error state if products can't be loaded
  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-md dark:bg-red-800 dark:text-red-300">
        <h3 className="text-lg font-semibold">Error</h3>
        <p>{error}</p>
        <button 
          onClick={() => navigate('/products')}
          className="mt-4 text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md transition-colors dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
          Back to Products
        </button>
      </div>
    );
  }

  // Render the current step of the personalization process
  const renderStep = () => {
    switch (state.step) {
      case 0:
        return <ProductSelectionStep />;
      case 1:
        return <TemplateSelectionStep />;
      case 2:
        return <TextCustomizationStep />;
      case 3:
        return <PreviewStep />;
      default:
        return <ProductSelectionStep />;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-700">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 dark:text-white">Personalize Your Product</h2>
      
      {/* Progress indicator */}
      <div className="mb-8">
        <ol className="flex items-center w-full text-sm font-medium text-center text-gray-500 dark:text-gray-400 sm:text-base">
          {["Select Product", "Choose Design", "Add Text", "Preview"].map((stepName, index) => (
            <li key={stepName} className={`flex md:w-full items-center ${index <= state.step ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-500'} ${index < 3 ? 'sm:after:content-[""] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-600' : ''}`}>
              <span className={`flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500 ${index <= state.step ? '' : 'opacity-60'}`}>
                {index < state.step ? (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                ) : (
                  <span className="mr-2">{index + 1}</span>
                )}
                {stepName}
              </span>
            </li>
          ))}
        </ol>
      </div>
      
      {/* Render current step */}
      {renderStep()}
    </div>
  );
};

export default PersonalizationFlow;