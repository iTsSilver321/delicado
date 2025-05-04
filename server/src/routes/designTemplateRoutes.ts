import { Router, RequestHandler } from 'express';
import { designTemplateController } from '../controllers/designTemplateController';

const router = Router();

// Convert controller methods to RequestHandler type
const getAllDesignTemplates: RequestHandler = async (req, res, next) => {
  try {
    await designTemplateController.getAllDesignTemplates(req, res);
  } catch (error) {
    next(error);
  }
};

const getDesignTemplateById: RequestHandler = async (req, res, next) => {
  try {
    await designTemplateController.getDesignTemplateById(req, res);
  } catch (error) {
    next(error);
  }
};

const getDesignTemplatesByCategory: RequestHandler = async (req, res, next) => {
  try {
    await designTemplateController.getDesignTemplatesByCategory(req, res);
  } catch (error) {
    next(error);
  }
};

const getDesignTemplatesByProductCategory: RequestHandler = async (req, res, next) => {
  try {
    await designTemplateController.getDesignTemplatesByProductCategory(req, res);
  } catch (error) {
    next(error);
  }
};

const createDesignTemplate: RequestHandler = async (req, res, next) => {
  try {
    await designTemplateController.createDesignTemplate(req, res);
  } catch (error) {
    next(error);
  }
};

const updateDesignTemplate: RequestHandler = async (req, res, next) => {
  try {
    await designTemplateController.updateDesignTemplate(req, res);
  } catch (error) {
    next(error);
  }
};

const deleteDesignTemplate: RequestHandler = async (req, res, next) => {
  try {
    await designTemplateController.deleteDesignTemplate(req, res);
  } catch (error) {
    next(error);
  }
};

// Routes - More specific routes BEFORE generic parameter routes
router.get('/', getAllDesignTemplates);
router.get('/category/:category', getDesignTemplatesByCategory);
router.get('/product-category/:productCategory', getDesignTemplatesByProductCategory);
router.get('/:id', getDesignTemplateById);
router.post('/', createDesignTemplate);
router.put('/:id', updateDesignTemplate);
router.delete('/:id', deleteDesignTemplate);

export default router;