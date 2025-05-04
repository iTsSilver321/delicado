import { Request, Response } from 'express';
import { db } from '../config/database';
import { DesignTemplate, CreateDesignTemplateDTO } from '../models/DesignTemplate';
import Joi from 'joi';

const designTemplateSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  image_url: Joi.string().uri().required(),
  category: Joi.string().required(),
  applicable_products: Joi.array().items(Joi.string()).required(),
});

const formatDesignTemplate = (template: any): DesignTemplate => ({
  ...template,
  applicable_products: Array.isArray(template.applicable_products) 
    ? template.applicable_products 
    : JSON.parse(template.applicable_products)
});

export const designTemplateController = {
  async getAllDesignTemplates(req: Request, res: Response) {
    try {
      const templates = await db.any<DesignTemplate>('SELECT * FROM design_templates ORDER BY name ASC');
      res.json(templates.map(formatDesignTemplate));
    } catch (error) {
      console.error('Error fetching design templates:', error);
      res.status(500).json({ error: 'Failed to fetch design templates' });
    }
  },

  async getDesignTemplateById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const template = await db.oneOrNone<DesignTemplate>('SELECT * FROM design_templates WHERE id = $1', [id]);
      
      if (!template) {
        return res.status(404).json({ error: 'Design template not found' });
      }
      
      res.json(formatDesignTemplate(template));
    } catch (error) {
      console.error('Error fetching design template:', error);
      res.status(500).json({ error: 'Failed to fetch design template' });
    }
  },

  async getDesignTemplatesByCategory(req: Request, res: Response) {
    try {
      const { category } = req.params;
      const templates = await db.any<DesignTemplate>(
        'SELECT * FROM design_templates WHERE category = $1 ORDER BY name ASC', 
        [category]
      );
      
      res.json(templates.map(formatDesignTemplate));
    } catch (error) {
      console.error('Error fetching design templates by category:', error);
      res.status(500).json({ error: 'Failed to fetch design templates' });
    }
  },

  async getDesignTemplatesByProductCategory(req: Request, res: Response) {
    try {
      const { productCategory } = req.params;
      const templates = await db.any<DesignTemplate>(
        "SELECT * FROM design_templates WHERE $1 = ANY(applicable_products) ORDER BY name ASC", 
        [productCategory]
      );
      
      res.json(templates.map(formatDesignTemplate));
    } catch (error) {
      console.error('Error fetching design templates by product category:', error);
      res.status(500).json({ error: 'Failed to fetch design templates' });
    }
  },

  async createDesignTemplate(req: Request, res: Response) {
    try {
      const templateData: CreateDesignTemplateDTO = req.body;
      
      const { error } = designTemplateSchema.validate(templateData);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const template = await db.one<DesignTemplate>(
        `INSERT INTO design_templates (
          name, description, image_url, category, applicable_products, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        ) RETURNING *`,
        [
          templateData.name,
          templateData.description,
          templateData.image_url,
          templateData.category,
          templateData.applicable_products,
        ]
      );
      
      res.status(201).json(formatDesignTemplate(template));
    } catch (error) {
      console.error('Error creating design template:', error);
      res.status(500).json({ error: 'Failed to create design template' });
    }
  },

  async updateDesignTemplate(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const templateData: Partial<CreateDesignTemplateDTO> = req.body;
      
      const { error } = designTemplateSchema.validate(templateData);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const template = await db.oneOrNone<DesignTemplate>(
        `UPDATE design_templates 
         SET name = $1, description = $2, image_url = $3, category = $4,
             applicable_products = $5, updated_at = CURRENT_TIMESTAMP
         WHERE id = $6
         RETURNING *`,
        [
          templateData.name,
          templateData.description,
          templateData.image_url,
          templateData.category,
          templateData.applicable_products,
          id,
        ]
      );

      if (!template) {
        return res.status(404).json({ error: 'Design template not found' });
      }
      
      res.json(formatDesignTemplate(template));
    } catch (error) {
      console.error('Error updating design template:', error);
      res.status(500).json({ error: 'Failed to update design template' });
    }
  },

  async deleteDesignTemplate(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await db.result('DELETE FROM design_templates WHERE id = $1', [id]);
      
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Design template not found' });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error('Error deleting design template:', error);
      res.status(500).json({ error: 'Failed to delete design template' });
    }
  }
};