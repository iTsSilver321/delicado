import { Request, Response } from 'express';
import { ContentModel } from '../models/ContentPage';

export async function listPages(req: Request, res: Response): Promise<void> {
  try {
    const pages = await ContentModel.getAll();
    res.json(pages);
  } catch (err) {
    console.error('Error listing content pages:', err);
    res.status(500).json({ error: 'Failed to list content pages' });
  }
}

export async function getPage(req: Request, res: Response): Promise<void> {
  try {
    const { slug } = req.params;
    const page = await ContentModel.findBySlug(slug);
    if (!page) {
      res.status(404).json({ error: 'Page not found' });
      return;
    }
    res.json(page);
  } catch (err) {
    console.error('Error fetching content page:', err);
    res.status(500).json({ error: 'Failed to fetch content page' });
  }
}

export async function createPage(req: Request, res: Response): Promise<void> {
  try {
    const user = (req as any).user;
    if (!user?.is_admin) { res.status(403).json({ error: 'Forbidden' }); return; }
    const { slug, title, content } = req.body;
    const page = await ContentModel.create({ slug, title, content });
    res.status(201).json(page);
  } catch (err) {
    console.error('Error creating content page:', err);
    res.status(500).json({ error: 'Failed to create content page' });
  }
}

export async function updatePage(req: Request, res: Response): Promise<void> {
  try {
    const user = (req as any).user;
    if (!user?.is_admin) { res.status(403).json({ error: 'Forbidden' }); return; }
    const { slug } = req.params;
    const { title, content } = req.body;
    const page = await ContentModel.update(slug, { title, content });
    res.json(page);
  } catch (err) {
    console.error('Error updating content page:', err);
    res.status(500).json({ error: 'Failed to update content page' });
  }
}

export async function deletePage(req: Request, res: Response): Promise<void> {
  try {
    const user = (req as any).user;
    if (!user?.is_admin) { res.status(403).json({ error: 'Forbidden' }); return; }
    const { slug } = req.params;
    await ContentModel.delete(slug);
    res.json({ message: 'Page deleted' });
  } catch (err) {
    console.error('Error deleting content page:', err);
    res.status(500).json({ error: 'Failed to delete content page' });
  }
}