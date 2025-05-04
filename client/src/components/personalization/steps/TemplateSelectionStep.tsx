import React, { useEffect } from 'react';
import { usePersonalization } from '../../../contexts/PersonalizationContext';
import { useDesignTemplates } from '../../../hooks/useDesignTemplates';
import { DesignTemplate } from '../../../types';
import { handleImageError } from '../../../utils/imageUtils';

const TemplateSelectionStep: React.FC = () => {
  const { state, selectTemplate, nextStep, previousStep, setAvailableTemplates } = usePersonalization();
  
  // Only fetch templates if we have a valid product category
  const productCategory = state.product?.category || '';
  const { templates, loading, error } = useDesignTemplates(
    productCategory ? productCategory : undefined
  );

  // Update available templates in context when they load
  useEffect(() => {
    if (templates.length > 0) {
      setAvailableTemplates(templates);
    }
  }, [templates, setAvailableTemplates]);

  if (!state.product) {
    return (
      <div className="text-center text-red-500 p-4 bg-red-100 rounded-md">
        Please select a product first.
      </div>
    );
  }

  const handleTemplateSelect = (template: DesignTemplate) => {
    selectTemplate(template);
    nextStep();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4 bg-red-100 rounded-md mb-4">
        <p>Error loading design templates. Please try again later.</p>
        <div className="mt-6 flex justify-between">
          <button 
            onClick={previousStep}
            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
          >
            Back
          </button>
          
          <button 
            onClick={nextStep}
            className="px-6 py-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            Skip (No Design)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Choose a Design Template</h3>
        <div className="flex gap-2">
          <div className="text-sm text-gray-500">
            Selected product: <span className="font-semibold text-gray-700">{state.product.name}</span>
          </div>
        </div>
      </div>

      {templates.length === 0 ? (
        <div className="text-center p-8 bg-yellow-50 rounded-lg">
          <p className="text-yellow-700">No design templates available for this product category.</p>
          <p className="mt-2 text-sm">You can continue without selecting a design.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div 
              key={template.id}
              className={`
                border rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-lg
                ${state.selectedTemplate?.id === template.id ? 'ring-2 ring-primary-500' : ''}
              `}
              onClick={() => handleTemplateSelect(template)}
            >
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={template.image_url} 
                  alt={template.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => handleImageError(e, 'template')}
                />
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-lg mb-1">{template.name}</h4>
                <p className="text-sm text-gray-600 line-clamp-2">{template.description}</p>
                <div className="mt-2">
                  <span className="text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded-full">
                    {template.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 flex justify-between">
        <button 
          onClick={previousStep}
          className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
        >
          Back
        </button>
        
        {/* Allow user to skip choosing a template */}
        <button 
          onClick={nextStep}
          className="px-6 py-2 text-gray-700 hover:text-gray-900 transition-colors"
        >
          Skip (No Design)
        </button>
      </div>
    </div>
  );
};

export default TemplateSelectionStep;