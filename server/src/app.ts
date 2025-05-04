import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import productRoutes from './routes/productRoutes';
import authRoutes from './routes/authRoutes';
import designTemplateRoutes from './routes/designTemplateRoutes';
import personalizationRoutes from './routes/personalizationRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database configuration
export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
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
      health: 'GET /api/health'
    }
  });
});

// Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/design-templates', designTemplateRoutes);
app.use('/api/personalizations', personalizationRoutes);

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