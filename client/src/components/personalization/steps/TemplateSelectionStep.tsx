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
      <div className="text-center text-red-500 p-4 bg-red-100 rounded-md dark:bg-red-800 dark:text-red-300">
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
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500 dark:border-primary-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4 bg-red-100 rounded-md mb-4 dark:bg-red-800 dark:text-red-300">
        <p>Error loading design templates. Please try again later.</p>
        <div className="mt-6 flex justify-between">
          <button onClick={previousStep} className="btn-secondary dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">Back to Product</button>
          <button onClick={() => { /* retry logic or navigate */ }} className="btn-primary">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="dark:text-gray-300">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold dark:text-white">Choose a Design Template</h3>
        <button 
          onClick={() => { 
            selectTemplate(undefined); // Clear selected template
            nextStep(); 
          }} 
          className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
        >
          Skip & Add Text Only
        </button>
      </div>

      {templates.length === 0 ? (
        <div className="text-center p-8 bg-yellow-50 rounded-lg dark:bg-yellow-700/30 dark:text-yellow-300">
          <p className="font-semibold mb-2">No specific templates for {state.product.category}.</p>
          <p>You can still proceed to add custom text to your product.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div 
              key={template.id}
              className={`border rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-lg dark:border-gray-600 dark:hover:shadow-primary-500/30 ${state.selectedTemplate?.id === template.id ? 'ring-2 ring-primary-500 dark:ring-primary-400' : 'dark:bg-gray-700'}`}
              onClick={() => handleTemplateSelect(template)}
            >
              <div className="h-40 bg-gray-200 dark:bg-gray-600 flex items-center justify-center overflow-hidden">
                {template.image_url ? (
                  <img 
                    src={template.image_url} 
                    alt={template.name} 
                    className="w-full h-full object-cover" 
                    onError={(e) => handleImageError(e, 'template')}
                  />
                ) : (
                  <span className="text-gray-500 dark:text-gray-400 text-sm p-2 text-center">{template.name} (No Image)</span>
                )}
              </div>
              <div className="p-3 dark:bg-gray-700">
                <h4 className="font-medium text-md mb-1 truncate dark:text-white">{template.name}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{template.description || 'No description'}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 flex justify-between">
        <button onClick={previousStep} className="btn-secondary dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">Back to Product</button>
        {/* The skip button above handles the "next" for no template selection */}
        {/* If a template is selected, nextStep is called in handleTemplateSelect */}
        {/* Consider adding an explicit "Next" if a template is selected but not automatically advancing */}
      </div>
    </div>
  );
};

export default TemplateSelectionStep;