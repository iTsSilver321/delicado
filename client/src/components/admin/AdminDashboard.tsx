import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-4 py-2 rounded hover:bg-gray-200 ${isActive ? 'bg-gray-300 font-semibold' : ''}`;
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <nav className="mb-4 space-x-4">
        <NavLink to="/admin/products" className={linkClass}>Products</NavLink>
        <NavLink to="/admin/designs" className={linkClass}>Design Templates</NavLink>
        <NavLink to="/admin/orders" className={linkClass}>Orders</NavLink>
        <NavLink to="/admin/users" className={linkClass}>Users</NavLink>
        <NavLink to="/admin/content" className={linkClass}>Content Pages</NavLink>
        <NavLink to="/admin/reports" className={linkClass}>Reports</NavLink>
      </nav>
      <div className="mt-6">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;