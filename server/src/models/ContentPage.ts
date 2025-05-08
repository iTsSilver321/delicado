import { db } from '../config/database';

export interface ContentPage {
  id: number;
  slug: string;
  title: string;
  content: string;
  created_at: Date;
  updated_at: Date;
}

export class ContentModel {
  static async getAll(): Promise<ContentPage[]> {
    return db.any('SELECT * FROM content_pages ORDER BY created_at DESC');
  }

  static async findBySlug(slug: string): Promise<ContentPage | null> {
    const page = await db.oneOrNone<ContentPage>('SELECT * FROM content_pages WHERE slug = $1', [slug]);
    return page; // may be ContentPage or null
  }

  static async create(data: { slug: string; title: string; content: string }): Promise<ContentPage> {
    const { slug, title, content } = data;
    return db.one(
      `INSERT INTO content_pages (slug, title, content)
       VALUES ($1, $2, $3) RETURNING *`,
      [slug, title, content]
    );
  }

  static async update(slug: string, data: { title?: string; content?: string }): Promise<ContentPage> {
    const existing = await db.oneOrNone('SELECT * FROM content_pages WHERE slug = $1', [slug]);
    if (!existing) throw new Error('Page not found');
    const newTitle = data.title ?? existing.title;
    const newContent = data.content ?? existing.content;
    return db.one(
      `UPDATE content_pages SET title=$1, content=$2, updated_at=now()
       WHERE slug=$3 RETURNING *`,
      [newTitle, newContent, slug]
    );
  }

  static async delete(slug: string): Promise<void> {
    await db.none('DELETE FROM content_pages WHERE slug = $1', [slug]);
  }
}