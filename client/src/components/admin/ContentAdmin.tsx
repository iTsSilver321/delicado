import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import api from '../../config/api';
import { ContentPage } from '../../types';

const ContentAdmin: React.FC = () => {
  const [pages, setPages] = useState<ContentPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<ContentPage | null>(null);
  const [form, setForm] = useState({ slug: '', title: '', content: '' });

  const fetchPages = async () => {
    try {
      setLoading(true);
      const res = await api.get<ContentPage[]>('/content-pages');
      setPages(res.data);
    } catch {
      setError('Failed to load pages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPages(); }, []);

  const handleDelete = async (slug: string) => {
    if (!window.confirm('Delete this page?')) return;
    try {
      await api.delete(`/content-pages/${slug}`);
      fetchPages();
    } catch {
      alert('Delete failed');
    }
  };

  const handleEdit = (page: ContentPage) => {
    setEditing(page);
    setForm({ slug: page.slug, title: page.title, content: page.content });
  };

  const handleAdd = () => {
    setEditing(null);
    setForm({ slug: '', title: '', content: '' });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/content-pages/${editing.slug}`, form);
      } else {
        await api.post('/content-pages', form);
      }
      setEditing(null);
      fetchPages();
    } catch {
      alert('Save failed');
    }
  };

  if (loading) return <p>Loading content pages...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Manage Content Pages</h2>
        <button onClick={handleAdd} className="px-4 py-2 bg-green-500 text-white rounded">
          Add Page
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded">
        <h3 className="text-lg mb-2">{editing ? 'Edit Page' : 'Create New Page'}</h3>
        <div className="grid grid-cols-1 gap-4">
          <input
            name="slug"
            placeholder="Slug (unique)"
            value={form.slug}
            onChange={handleChange}
            className="border p-2 rounded"
            disabled={!!editing}
            required
          />
          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <textarea
            name="content"
            placeholder="Content (HTML or markdown)"
            value={form.content}
            onChange={handleChange}
            className="border p-2 rounded h-32"
            required
          />
          <div className="flex space-x-2">
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
              Save
            </button>
            <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 bg-gray-300 rounded">
              Cancel
            </button>
          </div>
        </div>
      </form>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Slug</th>
            <th className="border px-4 py-2">Title</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pages.map(page => (
            <tr key={page.slug}>
              <td className="border px-4 py-2">{page.slug}</td>
              <td className="border px-4 py-2">{page.title}</td>
              <td className="border px-4 py-2 space-x-2">
                <button onClick={() => handleEdit(page)} className="text-blue-600">
                  Edit
                </button>
                <button onClick={() => handleDelete(page.slug)} className="text-red-600">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContentAdmin;