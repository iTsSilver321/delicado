import { useState, useEffect } from 'react';
import { DesignTemplate } from '../types';
import api from '../config/api';

interface UseDesignTemplatesResult {
  templates: DesignTemplate[];
  loading: boolean;
  error: string | null;
}

export const useDesignTemplates = (productCategory?: string): UseDesignTemplatesResult => {
  const [templates, setTemplates] = useState<DesignTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      try {
        let response;
        
        if (productCategory) {
          // Fetch templates filtered by product category
          response = await api.get(`/design-templates/product-category/${productCategory}`);
        } else {
          // Fetch all templates
          response = await api.get('/design-templates');
        }
        
        setTemplates(response.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching templates');
        console.error("Error fetching design templates:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, [productCategory]);

  return { templates, loading, error };
};

// Hook to fetch a single template by ID
export const useDesignTemplate = (templateId: number) => {
  const [template, setTemplate] = useState<DesignTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTemplate = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/design-templates/${templateId}`);
        setTemplate(response.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching the design template');
        console.error("Error fetching template:", err);
      } finally {
        setLoading(false);
      }
    };

    if (templateId) {
      fetchTemplate();
    }
  }, [templateId]);

  return { template, loading, error };
};