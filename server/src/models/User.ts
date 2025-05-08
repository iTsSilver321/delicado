import { db } from '../config/database';
import bcrypt from 'bcrypt';

export interface User {
  id: number;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  shipping_addresses?: any;
  is_admin: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface UserCreateDTO {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

export interface UserLoginDTO {
  email: string;
  password: string;
}

export class UserModel {
  static async findByEmail(email: string): Promise<User | undefined> {
    const user = await db.oneOrNone('SELECT * FROM users WHERE email = $1', [email]);
    return user || undefined;
  }

  static async findById(id: number): Promise<User | undefined> {
    const user = await db.oneOrNone('SELECT * FROM users WHERE id = $1', [id]);
    return user || undefined;
  }

  static async create(user: UserCreateDTO): Promise<User> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    
    const newUser = await db.one(
      `INSERT INTO users(
        email, password, first_name, last_name, phone, is_admin
      ) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        user.email,
        hashedPassword,
        user.first_name,
        user.last_name,
        user.phone || null,
        false // default is_admin to false
      ]
    );

    return newUser;
  }

  static async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  static async updateById(id: number, updateData: Partial<{ first_name: string; last_name: string; phone?: string }>): Promise<User> {
    const { first_name, last_name, phone } = updateData;
    const updatedUser = await db.one(
      `UPDATE users
       SET first_name = $1, last_name = $2, phone = $3, updated_at = now()
       WHERE id = $4
       RETURNING *`,
      [first_name, last_name, phone || null, id]
    );
    return updatedUser;
  }

  // Update user password
  static async updatePassword(id: number, newPassword: string): Promise<void> {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newPassword, salt);
    await db.none(
      `UPDATE users SET password = $1, updated_at = now() WHERE id = $2`,
      [hashed, id]
    );
  }

  // Update user's saved shipping addresses
  static async updateAddresses(id: number, addresses: any[]): Promise<User> {
    const updated = await db.one(
      `UPDATE users SET shipping_addresses = $1, updated_at = now() WHERE id = $2 RETURNING *`,
      [JSON.stringify(addresses), id]
    );
    return updated;
  }

  // Add method to list all users
  static async findAll(): Promise<User[]> {
    const users = await db.any('SELECT * FROM users ORDER BY created_at DESC');
    return users;
  }

  // Add method to set admin flag
  static async setAdmin(id: number, isAdmin: boolean): Promise<User> {
    const updated = await db.one(
      `UPDATE users SET is_admin = $1, updated_at = now() WHERE id = $2 RETURNING *`,
      [isAdmin, id]
    );
    return updated;
  }
}