import React, { useState, useEffect } from 'react';
import { usePersonalization } from '../../../contexts/PersonalizationContext';

// Available fonts for text customization
const availableFonts = [
  { name: 'Arial', value: 'Arial, sans-serif' },
  { name: 'Times New Roman', value: '"Times New Roman", serif' },
  { name: 'Courier New', value: '"Courier New", monospace' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Verdana', value: 'Verdana, sans-serif' },
  { name: 'Montserrat', value: 'Montserrat, sans-serif' }
];

// Available colors for text customization
const availableColors = [
  { name: 'Black', value: '#000000' },
  { name: 'White', value: '#FFFFFF' },
  { name: 'Red', value: '#FF0000' },
  { name: 'Blue', value: '#0000FF' },
  { name: 'Green', value: '#008000' },
  { name: 'Gold', value: '#FFD700' },
  { name: 'Silver', value: '#C0C0C0' },
  { name: 'Navy', value: '#000080' }
];

// Available font sizes for text customization
const availableSizes = [
  { name: 'Small', value: 16 },
  { name: 'Medium', value: 24 },
  { name: 'Large', value: 32 },
  { name: 'Extra Large', value: 48 }
];

const TextCustomizationStep: React.FC = () => {
  const { state, setCustomText, setTextOptions, nextStep, previousStep } = usePersonalization();
  const [currentFont, setCurrentFont] = useState(state.textOptions.font);
  const [currentSize, setCurrentSize] = useState(state.textOptions.size);
  const [currentColor, setCurrentColor] = useState(state.textOptions.color);
  const [text, setText] = useState(state.customText);
  const [previewStyle, setPreviewStyle] = useState({});

  // Update the text preview style based on user selections
  useEffect(() => {
    const fontFamily = availableFonts.find(f => f.name === currentFont)?.value || 'Arial, sans-serif';
    
    setPreviewStyle({
      fontFamily,
      fontSize: `${currentSize}px`,
      color: currentColor
    });
    
    // Update context with current options
    setTextOptions({
      font: currentFont,
      size: currentSize,
      color: currentColor,
      position: state.textOptions.position // Keep existing position
    });
  }, [currentFont, currentSize, currentColor, setTextOptions, state.textOptions.position]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    setCustomText(e.target.value);
  };
  
  const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentFont(e.target.value);
  };
  
  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentSize(Number(e.target.value));
  };
  
  const handleColorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentColor(e.target.value);
  };
  
  const handleContinue = () => {
    nextStep();
  };

  if (!state.product) {
    return (
      <div className="text-center text-red-500 p-4 bg-red-100 rounded-md">
        Please select a product first.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-semibold">Add Your Custom Text</h3>
        </div>
        <p className="text-gray-500">
          Add text that will be applied to your {state.product.name}
          {state.selectedTemplate ? ` with the ${state.selectedTemplate.name} design` : ''}.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left column: Text customization options */}
        <div className="space-y-6">
          {/* Text input */}
          <div>
            <label htmlFor="custom-text" className="block text-sm font-medium text-gray-700 mb-1">
              Your Custom Text
            </label>
            <textarea
              id="custom-text"
              value={text}
              onChange={handleTextChange}
              placeholder="Enter your text here..."
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              rows={4}
              maxLength={100}
            />
            <div className="text-xs text-gray-500 mt-1">
              {text.length}/100 characters
            </div>
          </div>

          {/* Font selection */}
          <div>
            <label htmlFor="font-select" className="block text-sm font-medium text-gray-700 mb-1">
              Font
            </label>
            <select
              id="font-select"
              value={currentFont}
              onChange={handleFontChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              {availableFonts.map((font) => (
                <option key={font.name} value={font.name}>
                  {font.name}
                </option>
              ))}
            </select>
          </div>

          {/* Font size selection */}
          <div>
            <label htmlFor="size-select" className="block text-sm font-medium text-gray-700 mb-1">
              Font Size
            </label>
            <select
              id="size-select"
              value={currentSize}
              onChange={handleSizeChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              {availableSizes.map((size) => (
                <option key={size.name} value={size.value}>
                  {size.name} ({size.value}px)
                </option>
              ))}
            </select>
          </div>

          {/* Color selection */}
          <div>
            <label htmlFor="color-select" className="block text-sm font-medium text-gray-700 mb-1">
              Text Color
            </label>
            <div className="flex gap-2">
              <select
                id="color-select"
                value={currentColor}
                onChange={handleColorChange}
                className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              >
                {availableColors.map((color) => (
                  <option key={color.name} value={color.value}>
                    {color.name}
                  </option>
                ))}
              </select>
              <div 
                className="w-10 h-10 border border-gray-300 rounded-md"
                style={{ backgroundColor: currentColor }}
              ></div>
            </div>
          </div>
        </div>

        {/* Right column: Preview */}
        <div className="border rounded-lg p-4 h-96 bg-gray-50 flex flex-col">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Text Preview</h4>
          
          <div className="flex-1 flex items-center justify-center overflow-hidden relative">
            {state.selectedTemplate && (
              <img 
                src={state.selectedTemplate.image_url} 
                alt={state.selectedTemplate.name} 
                className="max-w-full max-h-full object-contain opacity-20 absolute"
              />
            )}
            
            {text ? (
              <div 
                style={previewStyle}
                className="text-center z-10 p-4 break-words max-w-full"
              >
                {text}
              </div>
            ) : (
              <div className="text-gray-400 text-center">
                Enter text to see preview
              </div>
            )}
          </div>
          
          <div className="mt-2 text-xs text-gray-500">
            Note: This is a simplified preview. The final product may vary slightly.
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button 
          onClick={previousStep}
          className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
        >
          Back
        </button>
        
        <button 
          onClick={handleContinue}
          className="px-6 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default TextCustomizationStep;