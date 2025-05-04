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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // Show error state if products can't be loaded
  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-md">
        <h3 className="text-lg font-semibold">Error</h3>
        <p>{error}</p>
        <button 
          onClick={() => navigate('/products')}
          className="mt-4 text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md transition-colors">
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
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Personalize Your Product</h2>
      
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex justify-between">
          <div className={`text-sm ${state.step >= 0 ? 'text-primary-600 font-semibold' : 'text-gray-500'}`}>
            1. Select Product
          </div>
          <div className={`text-sm ${state.step >= 1 ? 'text-primary-600 font-semibold' : 'text-gray-500'}`}>
            2. Choose Design
          </div>
          <div className={`text-sm ${state.step >= 2 ? 'text-primary-600 font-semibold' : 'text-gray-500'}`}>
            3. Add Text
          </div>
          <div className={`text-sm ${state.step >= 3 ? 'text-primary-600 font-semibold' : 'text-gray-500'}`}>
            4. Preview
          </div>
        </div>
        <div className="mt-2 h-2 bg-gray-200 rounded-full">
          <div 
            className="h-full bg-primary-500 rounded-full transition-all duration-300"
            style={{ width: `${(state.step / 3) * 100}%` }}
          ></div>
        </div>
      </div>
      
      {/* Render current step */}
      {renderStep()}
    </div>
  );
};

export default PersonalizationFlow;