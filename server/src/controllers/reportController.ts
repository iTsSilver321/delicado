import { Request, Response } from 'express';
import { pool } from '../app'; // Assuming pool is exported from app.ts

// Helper function to ensure user is admin
const ensureAdmin = (req: Request, res: Response): boolean => {
  const user = (req as any).user;
  if (!user?.is_admin) {
    res.status(403).json({ message: 'Forbidden: Admin access required' });
    return false;
  }
  return true;
};

export const getReportData = async (req: Request, res: Response) => {
  if (!ensureAdmin(req, res)) return;

  try {
    // 1. Total Users
    const totalUsersResult = await pool.query('SELECT COUNT(*) AS total_users FROM users');
    const totalUsers = parseInt(totalUsersResult.rows[0].total_users, 10);

    // 2. Total Products
    const totalProductsResult = await pool.query('SELECT COUNT(*) AS total_products FROM products');
    const totalProducts = parseInt(totalProductsResult.rows[0].total_products, 10);

    // 3. Total Orders
    const totalOrdersResult = await pool.query('SELECT COUNT(*) AS total_orders FROM orders');
    const totalOrders = parseInt(totalOrdersResult.rows[0].total_orders, 10);

    // 4. Total Revenue
    const totalRevenueResult = await pool.query(`SELECT SUM(total_amount) AS total_revenue FROM orders WHERE status = 'completed'`);
    const totalRevenue = parseFloat(totalRevenueResult.rows[0].total_revenue || 0);

    // 5. Order Status Distribution
    const orderStatusResult = await pool.query(`
      SELECT status, COUNT(*) AS count
      FROM orders
      GROUP BY status
    `);
    const orderStatusDistribution = orderStatusResult.rows;

    // 6. Monthly Sales Trend (last 12 months)
    const monthlySalesResult = await pool.query(`
      SELECT
        TO_CHAR(created_at, 'YYYY-MM') AS month,
        SUM(total_amount) AS monthly_revenue
      FROM orders
      WHERE status = 'completed' AND created_at >= NOW() - INTERVAL '12 months'
      GROUP BY month
      ORDER BY month ASC
    `);
    const monthlySalesTrend = monthlySalesResult.rows;

    // 7. Top 5 Selling Products (based on quantity in orders, needs adjustment if items jsonb structure is known)
    // This query is a placeholder and might need significant adjustment based on how 'items' are stored in the 'orders' table.
    // Assuming 'items' is a JSONB array of objects, and each object has 'product_id' and 'quantity'.
    const topSellingProductsResult = await pool.query(`
      SELECT p.name, SUM((item->>'quantity')::integer) AS total_sold
      FROM orders o,
           jsonb_array_elements(o.items) AS item
      JOIN products p ON p.id = (item->>'product_id')::integer
      WHERE o.status = 'completed'
      GROUP BY p.name
      ORDER BY total_sold DESC
      LIMIT 5
    `);
    const topSellingProducts = topSellingProductsResult.rows;

    // 8. User Registrations per Month (last 12 months)
    const monthlyRegistrationsResult = await pool.query(`
      SELECT
        TO_CHAR(created_at, 'YYYY-MM') AS month,
        COUNT(*) AS new_users
      FROM users
      WHERE created_at >= NOW() - INTERVAL '12 months'
      GROUP BY month
      ORDER BY month ASC
    `);
    const userRegistrationTrend = monthlyRegistrationsResult.rows;

    // 9. Average Order Value (AOV)
    const averageOrderValueResult = await pool.query(`
      SELECT AVG(total_amount) AS average_order_value
      FROM orders
      WHERE status = 'completed'
    `);
    const averageOrderValue = parseFloat(averageOrderValueResult.rows[0].average_order_value || 0);

    // 10. Products Never Purchased
    // This query assumes 'items' is a JSONB array of objects, and each object has 'product_id'.
    const productsNeverPurchasedResult = await pool.query(`
      SELECT p.id, p.name
      FROM products p
      WHERE NOT EXISTS (
          SELECT 1
          FROM orders o,
               jsonb_array_elements(o.items) AS item
          WHERE (item->>'product_id')::integer = p.id
      )
    `);
    const productsNeverPurchased = productsNeverPurchasedResult.rows;

    // 11. Top 5 Most Active Users (by order count)
    const topActiveUsersResult = await pool.query(`
      SELECT u.id, u.email, COUNT(o.id) AS order_count
      FROM users u
      JOIN orders o ON u.id = o.user_id
      GROUP BY u.id, u.email
      ORDER BY order_count DESC
      LIMIT 5
    `);
    const topActiveUsers = topActiveUsersResult.rows;

    // 12. Orders by Day of the Week
    const ordersByDayOfWeekResult = await pool.query(`
      SELECT
        TRIM(TO_CHAR(created_at, 'Day')) AS day_of_week,
        COUNT(*) AS order_count
      FROM orders
      GROUP BY day_of_week, EXTRACT(ISODOW FROM created_at)
      ORDER BY EXTRACT(ISODOW FROM created_at)
    `);
    const ordersByDayOfWeek = ordersByDayOfWeekResult.rows.map(row => ({
      day_of_week: row.day_of_week,
      order_count: parseInt(row.order_count, 10)
    }));

    // 13. Product Category Distribution
    const productCategoryDistributionResult = await pool.query(`
      SELECT
        category,
        COUNT(*) AS product_count
      FROM products
      GROUP BY category
      ORDER BY category
    `);
    const productCategoryDistribution = productCategoryDistributionResult.rows.map(row => ({
      category: row.category,
      product_count: parseInt(row.product_count, 10)
    }));

    // 14. Payment Method Usage
    const paymentMethodUsageResult = await pool.query(`
      SELECT
        CASE
          WHEN payment_intent_id IS NOT NULL THEN 'Online Payment'
          ELSE 'Cash on Delivery'
        END AS payment_method,
        COUNT(*) AS usage_count
      FROM orders
      GROUP BY payment_method
    `);
    const paymentMethodUsage = paymentMethodUsageResult.rows.map(row => ({
      payment_method: row.payment_method,
      usage_count: parseInt(row.usage_count, 10)
    }));

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      orderStatusDistribution,
      monthlySalesTrend,
      topSellingProducts,
      userRegistrationTrend,
      averageOrderValue,
      productsNeverPurchased,
      topActiveUsers,
      ordersByDayOfWeek,
      productCategoryDistribution,
      paymentMethodUsage,
    });

  } catch (error) {
    console.error('Error generating report data:', error);
    res.status(500).json({ message: 'Failed to generate report data' });
  }
};
