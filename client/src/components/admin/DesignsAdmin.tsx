import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import api from '../../config/api';
import { DesignTemplate } from '../../types';
import { handleImageError } from '../../utils/imageUtils';

const DesignsAdmin: React.FC = () => {
  const [templates, setTemplates] = useState<DesignTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<DesignTemplate[]>('/design-templates')
      .then(res => setTemplates(res.data))
      .catch(err => { console.error(err); setError('Failed to load templates'); })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = (id: number) => {
    if (!window.confirm('Delete template?')) return;
    api.delete(`/design-templates/${id}`)
      .then(() => setTemplates(templates.filter(t => t.id !== id)))
      .catch(err => { console.error(err); alert('Failed to delete'); });
  };

  if (loading) return <p className="dark:text-accent-200">Loading...</p>;
  if (error) return <p className="text-red-600 dark:text-red-400">{error}</p>;

  return (
    <div className="dark:text-accent-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Manage Design Templates</h2>
        <Link to="create" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700">
          Add Template
        </Link>
      </div>
      <table className="w-full table-auto border-collapse dark:border-accent-700 bg-white dark:bg-accent-800 shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-200 dark:bg-accent-700">
            <th className="border px-4 py-2 dark:border-accent-600">ID</th>
            <th className="border px-4 py-2 dark:border-accent-600">Name</th>
            <th className="border px-4 py-2 dark:border-accent-600">Category</th>
            <th className="border px-4 py-2 dark:border-accent-600">Thumbnail</th>
            <th className="border px-4 py-2 dark:border-accent-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {templates.map(t => (
            <tr key={t.id} className="dark:hover:bg-accent-700/50">
              <td className="border px-4 py-2 dark:border-accent-600">{t.id}</td>
              <td className="border px-4 py-2 dark:border-accent-600">{t.name}</td>
              <td className="border px-4 py-2 dark:border-accent-600">{t.category}</td>
              <td className="border px-4 py-2 dark:border-accent-600">
                <img
                  src={t.image_url}
                  alt={t.name}
                  onError={(e) => handleImageError(e, 'template')}
                  className="h-16 w-24 object-cover rounded border dark:border-accent-600"
                />
              </td>
              <td className="border px-4 py-2 dark:border-accent-600 space-x-2">
                <Link to={`${t.id}/edit`} className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                  Edit
                </Link>
                <button onClick={() => handleDelete(t.id)} className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Nested routes (create/edit) */}
      <Outlet />
    </div>
  );
};

export default DesignsAdmin;