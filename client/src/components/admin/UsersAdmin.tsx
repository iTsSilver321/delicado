import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import { UserAdmin } from '../../types';

const UsersAdmin: React.FC = () => {
  const [users, setUsers] = useState<UserAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    api.get<UserAdmin[]>('/auth/users')
      .then(res => setUsers(res.data))
      .catch(err => { console.error(err); setError('Failed to load users'); })
      .finally(() => setLoading(false));
  }, []);

  const toggleAdmin = (id: number, current: boolean) => {
    setUpdatingId(id);
    api.put(`/auth/users/${id}`, { is_admin: !current })
      .then(res => {
        setUsers(users.map(u => u.id === id ? { ...u, is_admin: !current } : u));
      })
      .catch(err => { console.error(err); alert('Failed to update user'); })
      .finally(() => setUpdatingId(null));
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Manage Users</h2>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Admin</th>
            <th className="border px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td className="border px-4 py-2">{u.id}</td>
              <td className="border px-4 py-2">{u.first_name} {u.last_name}</td>
              <td className="border px-4 py-2">{u.email}</td>
              <td className="border px-4 py-2 text-center">{u.is_admin ? 'Yes' : 'No'}</td>
              <td className="border px-4 py-2 text-center">
                <button
                  onClick={() => toggleAdmin(u.id, u.is_admin)}
                  disabled={updatingId === u.id}
                  className={`px-3 py-1 rounded ${
                    updatingId === u.id
                      ? 'bg-gray-400'
                      : u.is_admin
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  {updatingId === u.id
                    ? 'Updating...'
                    : u.is_admin
                    ? 'Revoke Admin'
                    : 'Make Admin'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersAdmin;