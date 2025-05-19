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

  if (loading) return <div className="flex justify-center items-center h-screen"><p className="text-xl text-neutral-dark dark:text-neutral-light">Loading reports...</p></div>;
  if (error) return <div className="flex justify-center items-center h-screen"><p className="alert alert-error">{error}</p></div>;
  if (!reportData) return <div className="flex justify-center items-center h-screen"><p className="text-xl text-neutral-dark dark:text-neutral-light">No report data available.</p></div>;

  // Updated PIE_COLORS to match the new theme
  const PIE_COLORS = ['#6366F1', '#EC4899', '#10B981', '#F59E0B', '#8B5CF6', '#3B82F6', '#D946EF']; // primary, secondary, accent, yellow, violet, blue, fuchsia

  return (
    <div className="p-4 md:p-8 space-y-8 bg-background dark:bg-background-dark min-h-screen">
      <h1 className="text-3xl font-semibold text-neutral-extradark dark:text-white mb-8">Admin Dashboard Reports</h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        {[
          { title: 'Total Users', value: reportData.totalUsers },
          { title: 'Total Products', value: reportData.totalProducts },
          { title: 'Total Orders', value: reportData.totalOrders },
          { title: 'Total Revenue', value: `$${(reportData.totalRevenue ?? 0).toFixed(2)}` },
          { title: 'Avg. Order Value', value: `$${(reportData.averageOrderValue ?? 0).toFixed(2)}` },
        ].map(metric => (
          <div key={metric.title} className="card p-6 text-center border border-gray-300 dark:bg-gray-700 dark:border-gray-600">
            <h3 className="text-lg font-medium text-neutral-dark dark:text-white mb-2">{metric.title}</h3>
            <p className="text-4xl font-bold text-primary dark:text-white">{metric.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Status Distribution */}
        <div className="card p-6 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
          <h2 className="text-xl font-semibold mb-4 text-neutral-extradark dark:text-white">Order Status Distribution</h2>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={reportData.orderStatusDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="count"
                nameKey="status"
              >
                {reportData.orderStatusDistribution.map((entry, index) => (
                  <Cell key={`cell-status-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number, name: string) => [value, name]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Sales Trend */}
        <div className="card p-6 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
          <h2 className="text-xl font-semibold mb-4 text-neutral-extradark dark:text-white">Monthly Sales Trend</h2>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={reportData.monthlySalesTrend} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
              <XAxis dataKey="month" stroke="currentColor" className="text-sm" />
              <YAxis stroke="currentColor" className="text-sm" />
              <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
              <Legend />
              <Line type="monotone" dataKey="monthly_revenue" strokeWidth={2} stroke={PIE_COLORS[0]} activeDot={{ r: 8 }} name="Revenue" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      
        {/* User Registration Trend */}
        <div className="card p-6 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
          <h2 className="text-xl font-semibold mb-4 text-neutral-extradark dark:text-white">User Registrations</h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={reportData.userRegistrationTrend} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
              <XAxis dataKey="month" stroke="currentColor" className="text-sm" />
              <YAxis allowDecimals={false} stroke="currentColor" className="text-sm" />
              <Tooltip />
              <Legend />
              <Bar dataKey="new_users" fill={PIE_COLORS[2]} name="New Users" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Selling Products */}
        <div className="card p-6 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
          <h2 className="text-xl font-semibold mb-4 text-neutral-extradark dark:text-white">Top Selling Products</h2>
          {reportData.topSellingProducts.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={reportData.topSellingProducts} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                <XAxis type="number" stroke="currentColor" className="text-sm" />
                <YAxis dataKey="name" type="category" width={150} interval={0} stroke="currentColor" className="text-sm" />
                <Tooltip formatter={(value: number) => `${value} units`} />
                <Legend />
                <Bar dataKey="total_sold" fill={PIE_COLORS[1]} name="Units Sold" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-neutral dark:text-neutral-light">No sales data available for top products.</p>
          )}
        </div>

        {/* Top 5 Most Active Users */}
        <div className="card p-6 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
          <h2 className="text-xl font-semibold mb-4 text-neutral-extradark dark:text-white">Top Active Users</h2>
          {reportData.topActiveUsers.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={reportData.topActiveUsers} layout="vertical" margin={{ top: 5, right: 30, left: 150, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                <XAxis type="number" stroke="currentColor" className="text-sm" />
                <YAxis dataKey="email" type="category" width={200} interval={0} stroke="currentColor" className="text-sm" />
                <Tooltip formatter={(value: number) => `${value} orders`} />
                <Legend />
                <Bar dataKey="order_count" fill={PIE_COLORS[4]} name="Orders Placed" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-neutral dark:text-neutral-light">No user activity data available.</p>
          )}
        </div>
        
        {/* Orders by Day of the Week */}
        <div className="card p-6 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
          <h2 className="text-xl font-semibold mb-4 text-neutral-extradark dark:text-white">Orders by Day of the Week</h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={reportData.ordersByDayOfWeek} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
              <XAxis dataKey="day_of_week" stroke="currentColor" className="text-sm" />
              <YAxis allowDecimals={false} stroke="currentColor" className="text-sm" />
              <Tooltip />
              <Legend />
              <Bar dataKey="order_count" fill={PIE_COLORS[3]} name="Total Orders" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Product Category Distribution */}
        <div className="card p-6 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
          <h2 className="text-xl font-semibold mb-4 text-neutral-extradark dark:text-white">Product Category Distribution</h2>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={reportData.productCategoryDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="product_count"
                nameKey="category"
              >
                {reportData.productCategoryDistribution.map((entry, index) => (
                  <Cell key={`cell-cat-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number, name: string) => [value, name]}/>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Method Usage */}
        <div className="card p-6 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
          <h2 className="text-xl font-semibold mb-4 text-neutral-extradark dark:text-white">Payment Method Usage</h2>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={reportData.paymentMethodUsage}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="usage_count"
                nameKey="payment_method"
              >
                {reportData.paymentMethodUsage.map((entry, index) => (
                  <Cell key={`cell-pay-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number, name: string) => [value, name]}/>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Products Never Purchased - Table with modern styling */}
      <div className="card p-6 border border-gray-300 dark:bg-gray-700 dark:border-gray-600">
        <h2 className="text-xl font-semibold mb-6 text-neutral-extradark dark:text-white">Products Never Purchased</h2>
        {reportData.productsNeverPurchased.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead className="bg-neutral-extralight dark:bg-neutral-extradark">
                <tr>
                  <th className="p-3 text-left text-sm font-semibold text-neutral-dark dark:text-white tracking-wider">Product ID</th>
                  <th className="p-3 text-left text-sm font-semibold text-neutral-dark dark:text-white tracking-wider">Product Name</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-light dark:divide-neutral-dark">
                {reportData.productsNeverPurchased.map((product) => (
                  <tr key={product.id} className="hover:bg-neutral-extralight/50 dark:hover:bg-neutral-extradark/50 transition-colors">
                    <td className="p-3 text-sm text-neutral-dark dark:text-white">{product.id}</td>
                    <td className="p-3 text-sm text-neutral-dark dark:text-white">{product.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-neutral dark:text-white">All products have been purchased at least once, or no product data available.</p>
        )}
      </div>
    </div>
  );
};

export default ReportsAdmin;
