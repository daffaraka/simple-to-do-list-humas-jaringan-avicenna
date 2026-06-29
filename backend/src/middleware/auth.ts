import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Department } from '@prisma/client';

export interface AuthUser {
  id: string;
  email: string;
  department: Department;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Akses ditolak. Token tidak ditemukan.' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'super_secret_key_change_me_in_production';
    const decoded = jwt.verify(token, secret) as AuthUser;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token tidak valid atau kedaluwarsa.' });
  }
};
