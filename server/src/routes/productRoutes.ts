import { Router, RequestHandler } from 'express';
import { productController } from '../controllers/productController';

const router = Router();

// Convert controller methods to RequestHandler type
const getAllProducts: RequestHandler = async (req, res, next) => {
  try {
    await productController.getAllProducts(req, res);
  } catch (error) {
    next(error);
  }
};

const getProductById: RequestHandler = async (req, res, next) => {
  try {
    await productController.getProductById(req, res);
  } catch (error) {
    next(error);
  }
};

const createProduct: RequestHandler = async (req, res, next) => {
  try {
    await productController.createProduct(req, res);
  } catch (error) {
    next(error);
  }
};

const updateProduct: RequestHandler = async (req, res, next) => {
  try {
    await productController.updateProduct(req, res);
  } catch (error) {
    next(error);
  }
};

const deleteProduct: RequestHandler = async (req, res, next) => {
  try {
    await productController.deleteProduct(req, res);
  } catch (error) {
    next(error);
  }
};

// Product routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;