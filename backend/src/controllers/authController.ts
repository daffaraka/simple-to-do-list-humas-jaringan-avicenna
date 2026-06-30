import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../index';
import { AuthRequest } from '../middleware/auth';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, departmentId, roleId } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email sudah terdaftar' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        departmentId,
        roleId,
      },
    });

    res.status(201).json({ message: 'Registrasi berhasil', userId: user.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ 
      where: { email },
      include: { role: true, department: true } 
    });
    if (!user) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    const secret = process.env.JWT_SECRET || 'super_secret_key_change_me_in_production';
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, departmentId: user.departmentId, role: user.role },
      secret,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login berhasil',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        department: user.department,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id },
      select: { id: true, email: true, name: true, department: true, role: true },
    });
    
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};
