import express, { Router, RequestHandler } from 'express';
import { 
    createPaymentIntent, 
    handleWebhook, 
    getOrderById,
    getOrdersByUser,
    finalizeOrder,
    createCashOrder
} from '../controllers/paymentController';
import { auth } from '../middleware/auth';

const router = Router();

// Convert controller methods to RequestHandler type with error handling
const createPaymentIntentHandler: RequestHandler = async (req, res, next) => {
  try {
    await createPaymentIntent(req, res);
  } catch (error) {
    next(error);
  }
};

const handleWebhookHandler: RequestHandler = async (req, res, next) => {
  try {
    await handleWebhook(req, res);
  } catch (error) {
    next(error);
  }
};

const getOrderByIdHandler: RequestHandler = async (req, res, next) => {
  try {
    await getOrderById(req, res);
  } catch (error) {
    next(error);
  }
};

const getOrdersByUserHandler: RequestHandler = async (req, res, next) => {
  try {
    await getOrdersByUser(req, res);
  } catch (error) {
    next(error);
  }
};

const finalizeOrderHandler: RequestHandler = async (req, res, next) => {
  try {
    await finalizeOrder(req, res);
  } catch (err) {
    next(err);
  }
};

const createCashOrderHandler: RequestHandler = async (req, res, next) => {
  try {
    await createCashOrder(req, res);
  } catch (err) {
    next(err);
  }
};

// Create payment intent
router.post('/create-payment-intent', createPaymentIntentHandler);

// Handle webhook events from Stripe
// Raw body parsing middleware for Stripe webhooks
const rawBodyMiddleware: RequestHandler = express.raw({ type: 'application/json' });
router.post('/webhook', rawBodyMiddleware, handleWebhookHandler);

// Get order details
router.get('/orders/:id', auth, getOrderByIdHandler);

// Get current user's orders
router.get('/user', auth, getOrdersByUserHandler);

// Finalize order after client confirms payment (guest or logged-in)
router.post('/finalize-order', finalizeOrderHandler);

// Create cash order (guest or logged-in)
router.post('/cash-order', createCashOrderHandler);

export default router;