import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { UserModel, UserCreateDTO, UserLoginDTO } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret_for_dev';

export const register = async (req: Request, res: Response) => {
  try {
    console.log('Register route accessed');
    console.log('Request body:', req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const userData: UserCreateDTO = req.body;

    // Check if user already exists
    const existingUser = await UserModel.findByEmail(userData.email);
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email already exists' 
      });
    }

    // Create new user
    const newUser = await UserModel.create(userData);

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, isAdmin: newUser.is_admin },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('User registered successfully:', newUser.email);
    // Return user data and token (excluding password)
    const { password, ...userWithoutPassword } = newUser;
    return res.status(201).json({
      message: 'User registered successfully',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Server error during registration' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    console.log('Login route accessed');
    console.log('Request body:', req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const loginData: UserLoginDTO = req.body;

    // Find user by email
    const user = await UserModel.findByEmail(loginData.email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isPasswordValid = await UserModel.verifyPassword(
      loginData.password, 
      user.password
    );
    
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, isAdmin: user.is_admin },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user data and token (excluding password)
    const { password, ...userWithoutPassword } = user;
    return res.status(200).json({
      message: 'Login successful',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error during login' });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    console.log('Profile route accessed');
    console.log('User from token:', (req as any).user);
    // The user ID comes from the auth middleware that attaches the user to the request
    const userId = (req as any).user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user data (excluding password)
    const { password, ...userWithoutPassword } = user;
    return res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const { first_name, last_name, phone } = req.body;
    // Call model to update user
    const updated = await UserModel.updateById(userId, { first_name, last_name, phone });
    // Exclude password
    // @ts-ignore
    const { password, ...userWithoutPassword } = updated;
    return res.status(200).json({
      message: 'Profile updated successfully.',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ message: 'Server error during updating profile' });
  }
};

// Change password (requires oldPassword and newPassword)
export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { oldPassword, newPassword } = req.body;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    // Fetch user
    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Verify old password
    const valid = await UserModel.verifyPassword(oldPassword, user.password);
    if (!valid) return res.status(400).json({ message: 'Old password is incorrect' });

    // Update to new password
    await UserModel.updatePassword(userId, newPassword);
    return res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({ message: 'Server error during password change' });
  }
};

// Manage saved addresses
export const manageAddresses = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { addresses } = req.body;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    if (!Array.isArray(addresses)) return res.status(400).json({ message: 'Invalid addresses format' });

    // Update addresses
    const updatedUser = await UserModel.updateAddresses(userId, addresses);
    const { password, ...userWithoutPw } = updatedUser;
    return res.json({ message: 'Addresses updated', user: userWithoutPw });
  } catch (error) {
    console.error('Manage addresses error:', error);
    return res.status(500).json({ message: 'Server error during address update' });
  }
};

// List all users (admin only)
export const listUsers = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user?.is_admin) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const users = await UserModel.findAll();
    const sanitized = users.map(u => {
      const { password, ...rest } = u;
      return rest;
    });
    res.json(sanitized);
  } catch (err) {
    console.error('Error listing users:', err);
    res.status(500).json({ message: 'Failed to list users' });
  }
};

// Update user admin status (admin only)
export const updateUserAdmin = async (req: Request, res: Response) => {
  try {
    const current = (req as any).user;
    if (!current?.is_admin) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const id = parseInt(req.params.id, 10);
    const { is_admin } = req.body;
    if (typeof is_admin !== 'boolean') {
      return res.status(400).json({ message: 'Invalid is_admin flag' });
    }
    const updated = await UserModel.setAdmin(id, is_admin);
    const { password, ...rest } = updated;
    res.json({ message: 'User updated', user: rest });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Failed to update user' });
  }
};