import express from 'express';
import { auth } from '../middleware/auth';
import * as contentController from '../controllers/contentController';

const router = express.Router();

// Public: list and view pages
router.get('/', contentController.listPages);
router.get('/:slug', contentController.getPage);

// Admin: create, update, delete
router.post('/', auth, contentController.createPage);
router.put('/:slug', auth, contentController.updatePage);
router.delete('/:slug', auth, contentController.deletePage);

export default router;