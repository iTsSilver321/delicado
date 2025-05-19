import express from 'express';
import { auth } from '../middleware/auth';
import * as reportController from '../controllers/reportController';

const router = express.Router();

// GET all report data (admin only)
router.get('/', auth, reportController.getReportData);

export default router;
