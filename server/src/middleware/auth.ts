import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret_for_dev';

interface JwtPayload {
  id: number;
  email: string;
  isAdmin?: boolean;
  is_admin?: boolean;
}

export const auth = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({ message: 'No authentication token, access denied' });
      return;
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    
    // Add user from payload to request
    (req as any).user = {
      id: decoded.id,
      email: decoded.email,
      isAdmin: decoded.isAdmin || decoded.is_admin // Handle both naming conventions
    };

    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export const adminAuth = (req: Request, res: Response, next: NextFunction): void => {
  auth(req, res, () => {
    if ((req as any).user?.isAdmin) {
      next();
    } else {
      res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
  });
};