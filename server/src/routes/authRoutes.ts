import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/authController';
import { auth } from '../middleware/auth';

const router = express.Router();

// Validation for user registration
const registerValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('first_name').notEmpty().withMessage('First name is required'),
  body('last_name').notEmpty().withMessage('Last name is required')
];

// Validation for user login
const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

// Register a new user
router.post('/register', registerValidation, (req: Request, res: Response, next: NextFunction) => {
  authController.register(req, res).catch(next);
});

// Login user
router.post('/login', loginValidation, (req: Request, res: Response, next: NextFunction) => {
  authController.login(req, res).catch(next);
});

// Get user profile (protected route)
router.get('/profile', auth, (req: Request, res: Response, next: NextFunction) => {
  authController.getProfile(req, res).catch(next);
});

// Update profile route
router.put('/profile', auth, (req, res, next) => {
  authController.updateProfile(req, res).catch(next);
});

// Change password endpoint
router.post('/change-password', auth, (req, res, next) => {
  authController.changePassword(req, res).catch(next);
});

// Manage saved addresses endpoint
router.post('/addresses', auth, (req, res, next) => {
  authController.manageAddresses(req, res).catch(next);
});

// Admin: list all users
const listUsersHandler: RequestHandler = async (req, res, next) => {
  try {
    await authController.listUsers(req, res);
  } catch (err) {
    next(err);
  }
};

// Admin: update user admin flag
const updateUserAdminHandler: RequestHandler = async (req, res, next) => {
  try {
    await authController.updateUserAdmin(req, res);
  } catch (err) {
    next(err);
  }
};

// List all users (admin only)
router.get('/users', auth, listUsersHandler);
// Toggle user admin status
router.put('/users/:id', auth, updateUserAdminHandler);

export default router;