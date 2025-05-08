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

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Manage Design Templates</h2>
        <Link to="create" className="px-4 py-2 bg-green-500 text-white rounded">Add Template</Link>
      </div>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Category</th>
            <th className="border px-4 py-2">Thumbnail</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {templates.map(t => (
            <tr key={t.id}>
              <td className="border px-4 py-2">{t.id}</td>
              <td className="border px-4 py-2">{t.name}</td>
              <td className="border px-4 py-2">{t.category}</td>
              <td className="border px-4 py-2">
                <img
                  src={t.image_url}
                  alt={t.name}
                  onError={(e) => handleImageError(e, 'template')}
                  className="h-16 w-24 object-cover"
                />
              </td>
              <td className="border px-4 py-2 space-x-2">
                <Link to={`${t.id}/edit`} className="text-blue-600">Edit</Link>
                <button onClick={() => handleDelete(t.id)} className="text-red-600">Delete</button>
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