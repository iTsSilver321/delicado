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
      <div className="text-center text-red-500 p-4 bg-red-100 rounded-md dark:bg-red-800 dark:text-red-300">
        Please select a product first.
      </div>
    );
  }

  return (
    <div className="space-y-6 dark:text-gray-300">
      <div>
        <label htmlFor="customText" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Enter Your Text:</label>
        <textarea
          id="customText"
          value={text}
          onChange={handleTextChange}
          rows={3}
          className="form-textarea dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
          placeholder="E.g., Happy Birthday, John!"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="fontFamily" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Font Family:</label>
          <select id="fontFamily" value={currentFont} onChange={handleFontChange} className="form-select dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            {availableFonts.map(font => <option key={font.name} value={font.name}>{font.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="fontSize" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Font Size:</label>
          <select id="fontSize" value={currentSize} onChange={handleSizeChange} className="form-select dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            {availableSizes.map(size => <option key={size.name} value={size.value}>{size.name} ({size.value}px)</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="fontColor" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Font Color:</label>
          <select id="fontColor" value={currentColor} onChange={handleColorChange} className="form-select dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            {availableColors.map(color => <option key={color.name} value={color.value} style={{ color: color.value }}>{color.name}</option>)}
          </select>
        </div>
      </div>

      {text && (
        <div className="mt-6">
          <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">Text Preview:</h4>
          <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 min-h-[80px] flex items-center justify-center">
            <p style={previewStyle} className="break-words text-center">{text}</p>
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-between">
        <button onClick={previousStep} className="btn-secondary dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">Back</button>
        <button onClick={handleContinue} className="btn-primary">Continue to Preview</button>
      </div>
    </div>
  );
};

export default TextCustomizationStep;