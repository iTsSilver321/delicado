import React, { createContext, useContext, useReducer, ReactNode, useEffect, useRef } from 'react';
import { Product, DesignTemplate, PersonalizationConfig, TextOption } from '../types';

interface PersonalizationState {
  product: Product | null;
  availableTemplates: DesignTemplate[];
  selectedTemplate: DesignTemplate | null;
  customText: string;
  textOptions: TextOption;
  step: number; // Track the current step in the personalization flow
  loading: boolean;
  error: string | null;
}

type PersonalizationAction =
  | { type: 'SET_PRODUCT'; payload: Product }
  | { type: 'SET_AVAILABLE_TEMPLATES'; payload: DesignTemplate[] }
  | { type: 'SELECT_TEMPLATE'; payload: DesignTemplate }
  | { type: 'SET_CUSTOM_TEXT'; payload: string }
  | { type: 'SET_TEXT_OPTIONS'; payload: Partial<TextOption> }
  | { type: 'NEXT_STEP' }
  | { type: 'PREVIOUS_STEP' }
  | { type: 'GO_TO_STEP'; payload: number }
  | { type: 'RESET_PERSONALIZATION' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

interface PersonalizationContextType {
  state: PersonalizationState;
  setProduct: (product: Product) => void;
  setAvailableTemplates: (templates: DesignTemplate[]) => void;
  selectTemplate: (template: DesignTemplate) => void;
  setCustomText: (text: string) => void;
  setTextOptions: (options: Partial<TextOption>) => void;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: number) => void;
  resetPersonalization: () => void;
  getPersonalizationConfig: () => PersonalizationConfig | null;
}

const initialTextOptions: TextOption = {
  font: 'Arial',
  size: 24,
  color: '#000000',
  position: { x: 50, y: 50 } // Center position in percentage
};

const initialState: PersonalizationState = {
  product: null,
  availableTemplates: [],
  selectedTemplate: null,
  customText: '',
  textOptions: initialTextOptions,
  step: 0,
  loading: false,
  error: null
};

const defaultContextValue: PersonalizationContextType = {
  state: initialState,
  setProduct: () => {},
  setAvailableTemplates: () => {},
  selectTemplate: () => {},
  setCustomText: () => {},
  setTextOptions: () => {},
  nextStep: () => {},
  previousStep: () => {},
  goToStep: () => {},
  resetPersonalization: () => {},
  getPersonalizationConfig: () => null
};

const PersonalizationContext = createContext<PersonalizationContextType>(defaultContextValue);

const STORAGE_KEY = 'delicado_personalization';

// Safe storage access functions
const safeGetItem = (key: string): string | null => {
  try {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem(key);
  } catch (error) {
    console.warn('Failed to get item from storage:', error);
    return null;
  }
};

const safeSetItem = (key: string, value: string): void => {
  try {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(key, value);
  } catch (error) {
    console.warn('Failed to save item to storage:', error);
  }
};

const personalizationReducer = (
  state: PersonalizationState,
  action: PersonalizationAction
): PersonalizationState => {
  switch (action.type) {
    case 'SET_PRODUCT':
      return { ...state, product: action.payload };
    case 'SET_AVAILABLE_TEMPLATES':
      return { ...state, availableTemplates: action.payload };
    case 'SELECT_TEMPLATE':
      return { ...state, selectedTemplate: action.payload };
    case 'SET_CUSTOM_TEXT':
      return { ...state, customText: action.payload };
    case 'SET_TEXT_OPTIONS':
      return { 
        ...state, 
        textOptions: { ...state.textOptions, ...action.payload } 
      };
    case 'NEXT_STEP':
      return { ...state, step: state.step + 1 };
    case 'PREVIOUS_STEP':
      return { ...state, step: Math.max(0, state.step - 1) };
    case 'GO_TO_STEP':
      return { ...state, step: action.payload };
    case 'RESET_PERSONALIZATION':
      return initialState;
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

export const PersonalizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(personalizationReducer, initialState);
  const initialLoadDone = useRef(false);
  const skipNextSave = useRef(false);

  // Load personalization state from localStorage on component mount
  useEffect(() => {
    if (initialLoadDone.current) return;
    
    const savedState = safeGetItem(STORAGE_KEY);
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        if (parsedState.product) {
          dispatch({ type: 'SET_PRODUCT', payload: parsedState.product });
        }
        if (parsedState.selectedTemplate) {
          dispatch({ type: 'SELECT_TEMPLATE', payload: parsedState.selectedTemplate });
        }
        if (parsedState.customText) {
          dispatch({ type: 'SET_CUSTOM_TEXT', payload: parsedState.customText });
        }
        if (parsedState.textOptions) {
          dispatch({ type: 'SET_TEXT_OPTIONS', payload: parsedState.textOptions });
        }
        skipNextSave.current = true;
      } catch (error) {
        console.warn('Failed to parse personalization data:', error);
      }
    }
    initialLoadDone.current = true;
  }, []);

  // Save personalization state to localStorage when it changes
  useEffect(() => {
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }
    
    if (state.product || state.selectedTemplate || state.customText) {
      safeSetItem(
        STORAGE_KEY,
        JSON.stringify({
          product: state.product,
          selectedTemplate: state.selectedTemplate,
          customText: state.customText,
          textOptions: state.textOptions
        })
      );
    }
  }, [state.product, state.selectedTemplate, state.customText, state.textOptions]);

  const setProduct = (product: Product) => {
    dispatch({ type: 'SET_PRODUCT', payload: product });
  };

  const setAvailableTemplates = (templates: DesignTemplate[]) => {
    dispatch({ type: 'SET_AVAILABLE_TEMPLATES', payload: templates });
  };

  const selectTemplate = (template: DesignTemplate) => {
    dispatch({ type: 'SELECT_TEMPLATE', payload: template });
  };

  const setCustomText = (text: string) => {
    dispatch({ type: 'SET_CUSTOM_TEXT', payload: text });
  };

  const setTextOptions = (options: Partial<TextOption>) => {
    dispatch({ type: 'SET_TEXT_OPTIONS', payload: options });
  };

  const nextStep = () => {
    dispatch({ type: 'NEXT_STEP' });
  };

  const previousStep = () => {
    dispatch({ type: 'PREVIOUS_STEP' });
  };

  const goToStep = (step: number) => {
    dispatch({ type: 'GO_TO_STEP', payload: step });
  };

  const resetPersonalization = () => {
    dispatch({ type: 'RESET_PERSONALIZATION' });
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  };

  const getPersonalizationConfig = (): PersonalizationConfig | null => {
    if (!state.product || !state.selectedTemplate) {
      return null;
    }

    return {
      productId: state.product.id,
      templateId: state.selectedTemplate.id,
      customText: state.customText || undefined,
      textOptions: state.customText ? state.textOptions : undefined,
      previewUrl: state.selectedTemplate.image_url
    };
  };

  return (
    <PersonalizationContext.Provider
      value={{
        state,
        setProduct,
        setAvailableTemplates,
        selectTemplate,
        setCustomText,
        setTextOptions,
        nextStep,
        previousStep,
        goToStep,
        resetPersonalization,
        getPersonalizationConfig
      }}
    >
      {children}
    </PersonalizationContext.Provider>
  );
};

export const usePersonalization = () => {
  const context = useContext(PersonalizationContext);
  return context;
};