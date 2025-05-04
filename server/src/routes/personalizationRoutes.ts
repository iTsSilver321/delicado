import { Router, RequestHandler } from 'express';
import { personalizationController } from '../controllers/personalizationController';
import { auth } from '../middleware/auth';

const router = Router();

// Convert controller methods to RequestHandler type
const getAllPersonalizations: RequestHandler = async (req, res, next) => {
  try {
    await personalizationController.getAllPersonalizations(req, res);
  } catch (error) {
    next(error);
  }
};

const getPersonalizationById: RequestHandler = async (req, res, next) => {
  try {
    await personalizationController.getPersonalizationById(req, res);
  } catch (error) {
    next(error);
  }
};

const getUserPersonalizations: RequestHandler = async (req, res, next) => {
  try {
    await personalizationController.getUserPersonalizations(req, res);
  } catch (error) {
    next(error);
  }
};

const createPersonalization: RequestHandler = async (req, res, next) => {
  try {
    await personalizationController.createPersonalization(req, res);
  } catch (error) {
    next(error);
  }
};

const updatePersonalization: RequestHandler = async (req, res, next) => {
  try {
    await personalizationController.updatePersonalization(req, res);
  } catch (error) {
    next(error);
  }
};

const deletePersonalization: RequestHandler = async (req, res, next) => {
  try {
    await personalizationController.deletePersonalization(req, res);
  } catch (error) {
    next(error);
  }
};

// Public routes
router.post('/', createPersonalization);
router.get('/:id', getPersonalizationById);

// Protected routes (require authentication)
router.get('/', auth, getAllPersonalizations);
router.get('/user/:userId', auth, getUserPersonalizations);
router.put('/:id', auth, updatePersonalization);
router.delete('/:id', auth, deletePersonalization);

export default router;