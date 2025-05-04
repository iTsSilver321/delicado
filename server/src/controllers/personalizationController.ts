import { Request, Response } from 'express';
import { db } from '../config/database';
import { Personalization, CreatePersonalizationDTO, TextOptions } from '../models/Personalization';
import Joi from 'joi';

const textOptionsSchema = Joi.object({
  font: Joi.string().required(),
  size: Joi.number().required(),
  color: Joi.string().required(),
  position: Joi.object({
    x: Joi.number().required(),
    y: Joi.number().required()
  }).required()
});

const personalizationSchema = Joi.object({
  product_id: Joi.number().integer().positive().required(),
  template_id: Joi.number().integer().positive().allow(null),
  custom_text: Joi.string().allow('').allow(null),
  text_options: textOptionsSchema.allow(null),
  preview_url: Joi.string().uri().allow('').allow(null),
  user_id: Joi.number().integer().positive().allow(null)
});

const formatPersonalization = (personalization: any): Personalization => ({
  ...personalization,
  text_options: personalization.text_options ? personalization.text_options : undefined
});

export const personalizationController = {
  async getAllPersonalizations(req: Request, res: Response) {
    try {
      const personalizations = await db.any<Personalization>('SELECT * FROM personalizations ORDER BY created_at DESC');
      res.json(personalizations.map(formatPersonalization));
    } catch (error) {
      console.error('Error fetching personalizations:', error);
      res.status(500).json({ error: 'Failed to fetch personalizations' });
    }
  },

  async getPersonalizationById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const personalization = await db.oneOrNone<Personalization>('SELECT * FROM personalizations WHERE id = $1', [id]);
      
      if (!personalization) {
        return res.status(404).json({ error: 'Personalization not found' });
      }
      
      res.json(formatPersonalization(personalization));
    } catch (error) {
      console.error('Error fetching personalization:', error);
      res.status(500).json({ error: 'Failed to fetch personalization' });
    }
  },

  async getUserPersonalizations(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const personalizations = await db.any<Personalization>(
        'SELECT * FROM personalizations WHERE user_id = $1 ORDER BY created_at DESC', 
        [userId]
      );
      
      res.json(personalizations.map(formatPersonalization));
    } catch (error) {
      console.error('Error fetching user personalizations:', error);
      res.status(500).json({ error: 'Failed to fetch personalizations' });
    }
  },

  async createPersonalization(req: Request, res: Response) {
    try {
      const personalizationData: CreatePersonalizationDTO = req.body;
      
      const { error } = personalizationSchema.validate(personalizationData);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      // Check if product exists
      const productExists = await db.oneOrNone('SELECT id FROM products WHERE id = $1', [personalizationData.product_id]);
      if (!productExists) {
        return res.status(400).json({ error: 'Referenced product does not exist' });
      }

      // Check if template exists if provided
      if (personalizationData.template_id) {
        const templateExists = await db.oneOrNone('SELECT id FROM design_templates WHERE id = $1', [personalizationData.template_id]);
        if (!templateExists) {
          return res.status(400).json({ error: 'Referenced design template does not exist' });
        }
      }

      const personalization = await db.one<Personalization>(
        `INSERT INTO personalizations (
          product_id, template_id, custom_text, text_options, preview_url, user_id, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        ) RETURNING *`,
        [
          personalizationData.product_id,
          personalizationData.template_id || null,
          personalizationData.custom_text || null,
          personalizationData.text_options ? JSON.stringify(personalizationData.text_options) : null,
          personalizationData.preview_url || null,
          personalizationData.user_id || null
        ]
      );
      
      res.status(201).json(formatPersonalization(personalization));
    } catch (error) {
      console.error('Error creating personalization:', error);
      res.status(500).json({ error: 'Failed to create personalization' });
    }
  },

  async updatePersonalization(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const personalizationData: Partial<CreatePersonalizationDTO> = req.body;
      
      // Validate partial data
      const { error } = Joi.object({
        product_id: personalizationSchema.extract('product_id').optional(),
        template_id: personalizationSchema.extract('template_id').optional(),
        custom_text: personalizationSchema.extract('custom_text').optional(),
        text_options: personalizationSchema.extract('text_options').optional(),
        preview_url: personalizationSchema.extract('preview_url').optional(),
        user_id: personalizationSchema.extract('user_id').optional()
      }).validate(personalizationData);
      
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      // Get existing personalization to merge with updates
      const existingPersonalization = await db.oneOrNone<Personalization>('SELECT * FROM personalizations WHERE id = $1', [id]);
      if (!existingPersonalization) {
        return res.status(404).json({ error: 'Personalization not found' });
      }

      // Merge existing data with updates
      const updatedData = {
        product_id: personalizationData.product_id || existingPersonalization.product_id,
        template_id: personalizationData.template_id !== undefined ? personalizationData.template_id : existingPersonalization.template_id,
        custom_text: personalizationData.custom_text !== undefined ? personalizationData.custom_text : existingPersonalization.custom_text,
        text_options: personalizationData.text_options || existingPersonalization.text_options,
        preview_url: personalizationData.preview_url !== undefined ? personalizationData.preview_url : existingPersonalization.preview_url,
        user_id: personalizationData.user_id !== undefined ? personalizationData.user_id : existingPersonalization.user_id
      };

      const personalization = await db.oneOrNone<Personalization>(
        `UPDATE personalizations 
         SET product_id = $1, template_id = $2, custom_text = $3,
             text_options = $4, preview_url = $5, user_id = $6,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $7
         RETURNING *`,
        [
          updatedData.product_id,
          updatedData.template_id,
          updatedData.custom_text,
          updatedData.text_options ? JSON.stringify(updatedData.text_options) : null,
          updatedData.preview_url,
          updatedData.user_id,
          id
        ]
      );

      if (!personalization) {
        return res.status(404).json({ error: 'Personalization not found' });
      }
      
      res.json(formatPersonalization(personalization));
    } catch (error) {
      console.error('Error updating personalization:', error);
      res.status(500).json({ error: 'Failed to update personalization' });
    }
  },

  async deletePersonalization(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await db.result('DELETE FROM personalizations WHERE id = $1', [id]);
      
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Personalization not found' });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error('Error deleting personalization:', error);
      res.status(500).json({ error: 'Failed to delete personalization' });
    }
  }
};