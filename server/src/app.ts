import dotenv from 'dotenv';
import path from 'path';
import express from 'express';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import cors from 'cors';
import { Pool } from 'pg';
import productRoutes from './routes/productRoutes';
import authRoutes from './routes/authRoutes';
import designTemplateRoutes from './routes/designTemplateRoutes';
import personalizationRoutes from './routes/personalizationRoutes';
import paymentRoutes from './routes/paymentRoutes';
import contentRoutes from './routes/contentRoutes';
import reportRoutes from './routes/reportRoutes';

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(express.json());

// Database configuration
export const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'delicado',
  password: process.env.DB_PASSWORD || 'patrumai11',
  port: parseInt(process.env.DB_PORT || '5432'),
});

// Root route - API documentation
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Welcome to the Delicado API',
    version: '1.0.0',
    endpoints: {
      products: {
        list: 'GET /api/products',
        single: 'GET /api/products/:id',
        create: 'POST /api/products',
        update: 'PUT /api/products/:id',
        delete: 'DELETE /api/products/:id'
      },
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/profile'
      },
      designTemplates: {
        list: 'GET /api/design-templates',
        single: 'GET /api/design-templates/:id',
        byCategory: 'GET /api/design-templates/category/:category',
        byProductCategory: 'GET /api/design-templates/product-category/:productCategory',
        create: 'POST /api/design-templates',
        update: 'PUT /api/design-templates/:id',
        delete: 'DELETE /api/design-templates/:id'
      },
      personalizations: {
        create: 'POST /api/personalizations',
        single: 'GET /api/personalizations/:id',
        userPersonalizations: 'GET /api/personalizations/user/:userId',
        update: 'PUT /api/personalizations/:id',
        delete: 'DELETE /api/personalizations/:id'
      },
      payments: {
        createIntent: 'POST /api/payments/create-payment-intent',
        webhook: 'POST /api/payments/webhook',
        order: 'GET /api/payments/orders/:id'
      },
      health: 'GET /api/health'
    }
  });
});

// Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/design-templates', designTemplateRoutes);
app.use('/api/personalizations', personalizationRoutes);
app.use('/api/payments', paymentRoutes);
// Mount content pages routes
app.use('/api/content-pages', contentRoutes);
// Mount report routes
app.use('/api/reports', reportRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Global error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});