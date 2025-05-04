import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePersonalization } from '../../../contexts/PersonalizationContext';
import { useCart } from '../../../contexts/CartContext';
import { handleImageError } from '../../../utils/imageUtils';

const PreviewStep: React.FC = () => {
  const { state, previousStep, getPersonalizationConfig, resetPersonalization } = usePersonalization();
  const { addItem } = useCart();
  const navigate = useNavigate();
  
  if (!state.product) {
    return (
      <div className="text-center text-red-500 p-4 bg-red-100 rounded-md">
        Please select a product first.
      </div>
    );
  }

  const handleAddToCart = () => {
    // Get the personalization config
    const personalizationConfig = getPersonalizationConfig();
    
    // Add the personalized item to the cart
    addItem({ 
      ...state.product, 
      personalization: personalizationConfig || undefined 
    } as any); // Cast to 'any' to allow the extra 'personalization' property
    
    // Reset the personalization state
    resetPersonalization();
    
    // Navigate to products page
    navigate('/products');
  };

  // Generate a simple preview style for the custom text
  const textPreviewStyle = {
    fontFamily: state.textOptions.font === 'Arial' ? 'Arial, sans-serif' : 
               (state.textOptions.font === 'Times New Roman' ? '"Times New Roman", serif' : 
               (state.textOptions.font === 'Courier New' ? '"Courier New", monospace' : 
               (state.textOptions.font === 'Georgia' ? 'Georgia, serif' : 
               (state.textOptions.font === 'Verdana' ? 'Verdana, sans-serif' : 
               (state.textOptions.font === 'Montserrat' ? 'Montserrat, sans-serif' : 'sans-serif'))))),
    fontSize: `${state.textOptions.size}px`,
    color: state.textOptions.color
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-6">Preview Your Personalized Item</h3>

      <div className="bg-white border rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:gap-8">
            {/* Product image and text preview */}
            <div className="md:w-1/2 mb-6 md:mb-0 relative">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 relative">
                {/* Base product image with error handling */}
                <img 
                  src={state.product.image_url} 
                  alt={state.product.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => handleImageError(e, 'product')}
                />
                
                {/* Design template overlay (lower opacity) with error handling */}
                {state.selectedTemplate && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img 
                      src={state.selectedTemplate.image_url} 
                      alt={state.selectedTemplate.name} 
                      className="w-full h-full object-cover opacity-30"
                      onError={(e) => handleImageError(e, 'template')}
                    />
                  </div>
                )}

                {/* Custom text overlay */}
                {state.customText && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div 
                      style={textPreviewStyle}
                      className="text-center p-4 break-words max-w-full"
                    >
                      {state.customText}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="text-xs text-gray-500 mt-2 text-center">
                This is a digital representation. The final product may appear slightly different.
              </div>
            </div>

            {/* Product and personalization details */}
            <div className="md:w-1/2">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {state.product.name}
              </h2>
              
              <div className="text-lg font-semibold text-primary-600 mb-4">
                ${Number(state.product.price).toFixed(2)}
              </div>
              
              <div className="space-y-4 mb-6">
                <h3 className="font-semibold text-gray-900">Personalization Details</h3>
                
                <div className="border-t pt-2">
                  <h4 className="text-sm font-medium text-gray-700">Product:</h4>
                  <p className="text-gray-900">{state.product.name}</p>
                </div>
                
                {state.selectedTemplate && (
                  <div className="border-t pt-2">
                    <h4 className="text-sm font-medium text-gray-700">Design Template:</h4>
                    <p className="text-gray-900">{state.selectedTemplate.name}</p>
                  </div>
                )}
                
                {state.customText && (
                  <div className="border-t pt-2">
                    <h4 className="text-sm font-medium text-gray-700">Custom Text:</h4>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: state.textOptions.color }}
                      ></div>
                      <p className="text-gray-900 font-medium" style={{ fontFamily: textPreviewStyle.fontFamily }}>
                        {state.customText}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Font: {state.textOptions.font}, Size: {state.textOptions.size}px
                    </p>
                  </div>
                )}

                <div className="border-t pt-2">
                  <h4 className="text-sm font-medium text-gray-700">Product Specifications:</h4>
                  <ul className="text-sm text-gray-600 mt-2 space-y-1">
                    {state.product.material && (
                      <li>Material: {state.product.material}</li>
                    )}
                    {state.product.dimensions && (
                      <li>Dimensions: {state.product.dimensions}</li>
                    )}
                    {state.product.care && (
                      <li>Care: {state.product.care}</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 border-t">
          <div className="flex justify-between items-center">
            <button 
              onClick={previousStep}
              className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
            >
              Back
            </button>
            
            <button 
              onClick={handleAddToCart}
              className="px-8 py-3 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors flex items-center gap-2"
              disabled={state.product.stock <= 0}
            >
              {state.product.stock > 0 ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Add to Cart
                </>
              ) : (
                'Out of Stock'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewStep;