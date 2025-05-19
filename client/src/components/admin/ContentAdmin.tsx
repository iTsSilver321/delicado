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

  if (loading) return <p className="dark:text-accent-200">Loading content pages...</p>;
  if (error) return <p className="text-red-600 dark:text-red-400">{error}</p>;

  return (
    <div className="dark:text-accent-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Manage Content Pages</h2>
        <button onClick={handleAdd} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700">
          Add Page
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded dark:border-accent-700 bg-white dark:bg-accent-800 shadow-md">
        <h3 className="text-lg mb-2">{editing ? 'Edit Page' : 'Create New Page'}</h3>
        <div className="grid grid-cols-1 gap-4">
          <input
            name="slug"
            placeholder="Slug (unique)"
            value={form.slug}
            onChange={handleChange}
            className="border p-2 rounded dark:bg-accent-700 dark:border-accent-600 dark:text-accent-200 disabled:opacity-50"
            disabled={!!editing}
            required
          />
          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            className="border p-2 rounded dark:bg-accent-700 dark:border-accent-600 dark:text-accent-200"
            required
          />
          <textarea
            name="content"
            placeholder="Content (HTML or markdown)"
            value={form.content}
            onChange={handleChange}
            className="border p-2 rounded h-32 dark:bg-accent-700 dark:border-accent-600 dark:text-accent-200"
            required
          />
          <div className="flex space-x-2">
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700">
              Save
            </button>
            <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 dark:bg-accent-600 dark:hover:bg-accent-500 dark:text-accent-200">
              Cancel
            </button>
          </div>
        </div>
      </form>

      <table className="w-full table-auto border-collapse dark:border-accent-700 bg-white dark:bg-accent-800 shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-200 dark:bg-accent-700">
            <th className="border px-4 py-2 dark:border-accent-600">Slug</th>
            <th className="border px-4 py-2 dark:border-accent-600">Title</th>
            <th className="border px-4 py-2 dark:border-accent-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pages.map(page => (
            <tr key={page.slug} className="dark:hover:bg-accent-700/50">
              <td className="border px-4 py-2 dark:border-accent-600">{page.slug}</td>
              <td className="border px-4 py-2 dark:border-accent-600">{page.title}</td>
              <td className="border px-4 py-2 dark:border-accent-600 space-x-2">
                <button onClick={() => handleEdit(page)} className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                  Edit
                </button>
                <button onClick={() => handleDelete(page.slug)} className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
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