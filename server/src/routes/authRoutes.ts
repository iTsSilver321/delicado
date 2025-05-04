import express, { Request, Response, NextFunction } from 'express';
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

export default router;