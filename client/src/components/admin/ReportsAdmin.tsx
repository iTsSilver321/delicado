import React, { useEffect, useState } from 'react';
import { api } from '../../config/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface ReportData {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  orderStatusDistribution: Array<{ status: string; count: string | number }>;
  monthlySalesTrend: Array<{ month: string; monthly_revenue: string | number }>;
  topSellingProducts: Array<{ name: string; total_sold: string | number }>;
  userRegistrationTrend: Array<{ month: string; new_users: string | number }>;
  averageOrderValue: number;
  productsNeverPurchased: Array<{ id: number; name: string }>;
  topActiveUsers: Array<{ id: number; email: string; order_count: string | number }>;
  ordersByDayOfWeek: Array<{ day_of_week: string; order_count: number }>;
  productCategoryDistribution: Array<{ category: string; product_count: number }>;
  paymentMethodUsage: Array<{ payment_method: string; usage_count: number }>;
}

const ReportsAdmin: React.FC = () => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<ReportData>('/reports')
      .then(res => {
        const data = res.data;
        // Ensure all numeric fields are consistently treated as numbers
        data.totalUsers = Number(data.totalUsers || 0);
        data.totalProducts = Number(data.totalProducts || 0);
        data.totalOrders = Number(data.totalOrders || 0);
        data.totalRevenue = Number(data.totalRevenue || 0);
        data.averageOrderValue = Number(data.averageOrderValue || 0);

        data.orderStatusDistribution = data.orderStatusDistribution.map(item => ({ ...item, count: Number(item.count) }));
        data.monthlySalesTrend = data.monthlySalesTrend.map(item => ({ ...item, monthly_revenue: Number(item.monthly_revenue) }));
        data.topSellingProducts = data.topSellingProducts.map(item => ({ ...item, total_sold: Number(item.total_sold) }));
        data.userRegistrationTrend = data.userRegistrationTrend.map(item => ({ ...item, new_users: Number(item.new_users) }));
        data.topActiveUsers = data.topActiveUsers.map(user => ({ ...user, order_count: Number(user.order_count) }));
        
        // Convert new report data
        data.ordersByDayOfWeek = data.ordersByDayOfWeek.map(item => ({ ...item, order_count: Number(item.order_count) }));
        data.productCategoryDistribution = data.productCategoryDistribution.map(item => ({ ...item, product_count: Number(item.product_count) }));
        data.paymentMethodUsage = data.paymentMethodUsage.map(item => ({ ...item, usage_count: Number(item.usage_count) }));

        setReportData(data);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load report data. ' + (err.response?.data?.message || err.message));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading reports...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!reportData) return <p>No report data available.</p>;

  const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF6384', '#36A2EB'];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold mb-6">Admin Reports</h2>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-4 shadow rounded">
          <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
          <p className="text-3xl font-bold">{reportData.totalUsers ?? '0'}</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <h3 className="text-lg font-semibold text-gray-700">Total Products</h3>
          <p className="text-3xl font-bold">{reportData.totalProducts ?? '0'}</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <h3 className="text-lg font-semibold text-gray-700">Total Orders</h3>
          <p className="text-3xl font-bold">{reportData.totalOrders ?? '0'}</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <h3 className="text-lg font-semibold text-gray-700">Total Revenue</h3>
          <p className="text-3xl font-bold">
            ${(reportData.totalRevenue ?? 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <h3 className="text-lg font-semibold text-gray-700">Average Order Value</h3>
          <p className="text-3xl font-bold">
            ${(reportData.averageOrderValue ?? 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Order Status Distribution */}
      <div className="bg-white p-6 shadow rounded">
        <h3 className="text-xl font-semibold mb-4">Order Status Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={reportData.orderStatusDistribution}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="count"
              nameKey="status"
            >
              {reportData.orderStatusDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly Sales Trend */}
      <div className="bg-white p-6 shadow rounded">
        <h3 className="text-xl font-semibold mb-4">Monthly Sales Trend (Last 12 Months)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={reportData.monthlySalesTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
            <Legend />
            <Line type="monotone" dataKey="monthly_revenue" stroke="#8884d8" activeDot={{ r: 8 }} name="Revenue" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* User Registration Trend */}
      <div className="bg-white p-6 shadow rounded">
        <h3 className="text-xl font-semibold mb-4">User Registrations (Last 12 Months)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={reportData.userRegistrationTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="new_users" fill="#82ca9d" name="New Users" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Selling Products - Replaced Table with Bar Chart */}
      <div className="bg-white p-6 shadow rounded">
        <h3 className="text-xl font-semibold mb-4">Top 5 Selling Products</h3>
        {reportData.topSellingProducts.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reportData.topSellingProducts} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={150} interval={0} />
              <Tooltip formatter={(value: number) => `${value} units`} />
              <Legend />
              <Bar dataKey="total_sold" fill="#8884d8" name="Units Sold" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p>No sales data available for top products.</p>
        )}
      </div>

      {/* Products Never Purchased */}
      <div className="bg-white p-6 shadow rounded">
        <h3 className="text-xl font-semibold mb-4">Products Never Purchased</h3>
        {reportData.productsNeverPurchased.length > 0 ? (
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Product ID</th>
                <th className="border p-2 text-left">Product Name</th>
              </tr>
            </thead>
            <tbody>
              {reportData.productsNeverPurchased.map((product) => (
                <tr key={product.id}>
                  <td className="border p-2">{product.id}</td>
                  <td className="border p-2">{product.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>All products have been purchased at least once, or no product data available.</p>
        )}
      </div>

      {/* Top 5 Most Active Users - Replaced Table with Bar Chart */}
      <div className="bg-white p-6 shadow rounded">
        <h3 className="text-xl font-semibold mb-4">Top 5 Most Active Users (by Order Count)</h3>
        {reportData.topActiveUsers.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reportData.topActiveUsers} layout="vertical" margin={{ top: 5, right: 30, left: 150, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="email" type="category" width={200} interval={0} />
              <Tooltip formatter={(value: number) => `${value} orders`} />
              <Legend />
              <Bar dataKey="order_count" fill="#82ca9d" name="Orders Placed" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p>No user activity data available.</p>
        )}
      </div>

      {/* Orders by Day of the Week */}
      <div className="bg-white p-6 shadow rounded">
        <h3 className="text-xl font-semibold mb-4">Orders by Day of the Week</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={reportData.ordersByDayOfWeek}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day_of_week" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="order_count" fill="#FF8042" name="Total Orders" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Product Category Distribution */}
      <div className="bg-white p-6 shadow rounded">
        <h3 className="text-xl font-semibold mb-4">Product Category Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={reportData.productCategoryDistribution}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="product_count"
              nameKey="category"
            >
              {reportData.productCategoryDistribution.map((entry, index) => (
                <Cell key={`cell-cat-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Payment Method Usage */}
      <div className="bg-white p-6 shadow rounded">
        <h3 className="text-xl font-semibold mb-4">Payment Method Usage</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={reportData.paymentMethodUsage}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="usage_count"
              nameKey="payment_method"
            >
              {reportData.paymentMethodUsage.map((entry, index) => (
                <Cell key={`cell-pay-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default ReportsAdmin;
