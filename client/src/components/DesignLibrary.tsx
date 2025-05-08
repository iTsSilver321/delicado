import React, { useState, useMemo } from 'react';
import { useDesignTemplates } from '../hooks/useDesignTemplates';
import { DesignTemplate } from '../types';
import { handleImageError } from '../utils/imageUtils';

const DesignLibrary: React.FC = () => {
  const { templates, loading, error } = useDesignTemplates();
  const [categoryFilter, setCategoryFilter] = useState('All');

  // derive list of template categories
  const categories = useMemo(
    () => ['All', ...Array.from(new Set(templates.map(t => t.category)))],
    [templates]
  );

  // filter templates by category
  const filtered = useMemo(
    () =>
      categoryFilter === 'All'
        ? templates
        : templates.filter(t => t.category === categoryFilter),
    [templates, categoryFilter]
  );

  if (loading) return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div></div>;
  if (error) return <div className="text-red-500 p-4 bg-red-100 rounded-md">Error loading templates: {error}</div>;

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Design Library</h2>
      <div className="flex items-center space-x-4 mb-4">
        <label className="font-medium text-gray-700">Category:</label>
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      {filtered.length === 0 ? (
        <div className="text-gray-500 p-8 text-center">No templates found in this category.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((template: DesignTemplate) => (
            <div key={template.id} className="group bg-white rounded-lg shadow-md overflow-hidden transform transition hover:shadow-xl hover:scale-105">
              <div className="h-48 overflow-hidden">
                <img
                  src={template.image_url}
                  alt={template.name}
                  className="w-full h-full object-cover"
                  onError={e => handleImageError(e, 'template')}
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1 text-gray-900 line-clamp-2">{template.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{template.description}</p>
                <div className="mt-2">
                  <span className="text-xs text-white bg-primary-500 px-2 py-1 rounded-full">
                    {template.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DesignLibrary;