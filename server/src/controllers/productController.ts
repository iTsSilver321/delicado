import { Request, Response } from 'express';
import { db } from '../config/database';
import { Product, CreateProductDTO } from '../models/Product';
import Joi from 'joi';

const productSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().positive().required(),
  category: Joi.string().required(),
  image_url: Joi.string().uri().required(),
  stock: Joi.number().min(0).required(),
  dimensions: Joi.string().optional(),
  material: Joi.string().optional(),
  care: Joi.string().optional(),
});

const formatProduct = (product: any): Product => ({
  ...product,
  price: parseFloat(product.price),
  stock: parseInt(product.stock)
});

export const productController = {
  async getAllProducts(req: Request, res: Response) {
    try {
      const products = await db.any<Product>('SELECT * FROM products ORDER BY created_at DESC');
      res.json(products.map(formatProduct));
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  },

  async getProductById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const product = await db.oneOrNone<Product>('SELECT * FROM products WHERE id = $1', [id]);
      
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      res.json(formatProduct(product));
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ error: 'Failed to fetch product' });
    }
  },

  async createProduct(req: Request, res: Response) {
    try {
      const productData: CreateProductDTO = req.body;
      
      const { error } = productSchema.validate(productData);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const product = await db.one<Product>(
        `INSERT INTO products (
          name, description, price, category, image_url, stock,
          dimensions, material, care, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        ) RETURNING *`,
        [
          productData.name,
          productData.description,
          productData.price,
          productData.category,
          productData.image_url,
          productData.stock,
          productData.dimensions,
          productData.material,
          productData.care,
        ]
      );
      
      res.status(201).json(formatProduct(product));
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ error: 'Failed to create product' });
    }
  },

  async updateProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const productData: Partial<CreateProductDTO> = req.body;
      
      const { error } = productSchema.validate(productData);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const product = await db.oneOrNone<Product>(
        `UPDATE products 
         SET name = $1, description = $2, price = $3, category = $4,
             image_url = $5, stock = $6, dimensions = $7, material = $8,
             care = $9, updated_at = CURRENT_TIMESTAMP
         WHERE id = $10
         RETURNING *`,
        [
          productData.name,
          productData.description,
          productData.price,
          productData.category,
          productData.image_url,
          productData.stock,
          productData.dimensions,
          productData.material,
          productData.care,
          id,
        ]
      );

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.json(formatProduct(product));
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ error: 'Failed to update product' });
    }
  },

  async deleteProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const product = await db.oneOrNone<Product>(
        'DELETE FROM products WHERE id = $1 RETURNING *',
        [id]
      );

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ error: 'Failed to delete product' });
    }
  },
};