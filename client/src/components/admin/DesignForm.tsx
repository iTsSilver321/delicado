import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../config/api';
import { DesignTemplate, Product } from '../../types';

const DesignForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const editing = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState<Partial<DesignTemplate>>({
    name: '',
    category: '',
    image_url: '',
    applicable_products: []
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // fetch products for selector
  useEffect(() => {
    api.get<Product[]>('/products')
      .then(res => setProducts(res.data))
      .catch(() => {/* ignore */});
  }, []);

  // fetch template if editing
  useEffect(() => {
    if (editing) {
      setLoading(true);
      api.get<DesignTemplate>(`/design-templates/${id}`)
        .then(res => setForm(res.data))
        .catch(() => setError('Failed to load template'))
        .finally(() => setLoading(false));
    }
  }, [editing, id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLSelectElement;
    const { name, value, multiple } = target;
    if (name === 'applicable_products' && multiple) {
      const selected = Array.from(target.selectedOptions).map(opt => Number(opt.value));
      setForm(prev => ({ ...(prev as any), applicable_products: selected }));
    } else {
      setForm(prev => ({ ...(prev as any), [name]: value }));
    }
  };

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setForm(prev => ({ ...(prev as any), image_url: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (editing && id) {
        await api.put(`/design-templates/${id}`, form);
      } else {
        await api.post('/design-templates', form);
      }
      navigate('/admin/designs');
    } catch {
      setError('Save failed');
    }
  };

  if (loading) return <p className="dark:text-accent-200">Loading template...</p>;
  if (error) return <p className="text-red-600 dark:text-red-400">{error}</p>;

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 bg-white dark:bg-accent-800 shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">{editing ? 'Edit Design Template' : 'Add Design Template'}</h2>
      <div className="space-y-4">
        <div>
          <label className="block mb-1 text-gray-700 dark:text-accent-300">Name</label>
          <input
            name="name"
            value={form.name || ''}
            onChange={handleChange}
            className="w-full border p-2 rounded dark:bg-accent-700 dark:border-accent-600 dark:text-accent-200 focus:ring-primary-500 focus:border-primary-500"
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-700 dark:text-accent-300">Category</label>
          <input
            name="category"
            value={form.category || ''}
            onChange={handleChange}
            className="w-full border p-2 rounded dark:bg-accent-700 dark:border-accent-600 dark:text-accent-200 focus:ring-primary-500 focus:border-primary-500"
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-700 dark:text-accent-300">Image</label>
          <input type="file" accept="image/*" onChange={handleFile} className="block mb-2 text-gray-700 dark:text-accent-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 dark:file:bg-accent-700 dark:file:text-accent-200 dark:hover:file:bg-accent-600" />
          {form.image_url && (
            <img src={form.image_url} alt="Preview" className="h-32 object-cover rounded border dark:border-accent-600" />
          )}
        </div>
        <div>
          <label className="block mb-1 text-gray-700 dark:text-accent-300">Applicable Products</label>
          <select
            name="applicable_products"
            multiple
            value={(form.applicable_products ?? []).map(String)}
            onChange={handleChange}
            className="w-full border p-2 rounded h-40 dark:bg-accent-700 dark:border-accent-600 dark:text-accent-200 focus:ring-primary-500 focus:border-primary-500"
          >
            {products.map(p => (
              <option key={p.id} value={p.id} className="dark:bg-accent-700 dark:text-accent-200">
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex space-x-2">
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
            Save
          </button>
          <button type="button" onClick={() => navigate('/admin/designs')} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 dark:bg-accent-600 dark:hover:bg-accent-500 dark:text-accent-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50">
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
};

export default DesignForm;