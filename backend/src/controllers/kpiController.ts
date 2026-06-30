import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const getKpis = async (req: AuthRequest, res: Response) => {
  try {
    const userRole = req.user?.role?.name;
    const userId = req.user?.id;

    const kpis = await prisma.kpi.findMany({
      include: {
        user: true,
        department: true,
        boards: {
          include: {
            tasks: true,
            user: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(kpis);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch KPIs' });
  }
};

export const createKpi = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, targetDate, departmentId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const kpi = await prisma.kpi.create({
      data: {
        title,
        description,
        targetDate: new Date(targetDate),
        userId,
        departmentId: departmentId || req.user?.departmentId
      },
      include: {
        department: true,
        user: true,
        boards: true
      }
    });

    res.status(201).json(kpi);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create KPI' });
  }
};

export const updateKpi = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, targetDate } = req.body;
    
    // Check permission
    const existingKpi = await prisma.kpi.findUnique({ where: { id } });
    if (!existingKpi) return res.status(404).json({ error: 'KPI not found' });
    
    if (req.user?.role?.name !== 'Admin' && existingKpi.userId !== req.user?.id) {
       return res.status(403).json({ error: 'Forbidden' });
    }

    const kpi = await prisma.kpi.update({
      where: { id },
      data: {
        title,
        description,
        targetDate: targetDate ? new Date(targetDate) : undefined,
      },
      include: {
        department: true,
        user: true,
        boards: true
      }
    });

    res.json(kpi);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update KPI' });
  }
};

export const deleteKpi = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    const existingKpi = await prisma.kpi.findUnique({ where: { id } });
    if (!existingKpi) return res.status(404).json({ error: 'KPI not found' });
    
    if (req.user?.role?.name !== 'Admin' && existingKpi.userId !== req.user?.id) {
       return res.status(403).json({ error: 'Forbidden' });
    }

    await prisma.kpi.delete({
      where: { id }
    });

    res.json({ message: 'KPI deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete KPI' });
  }
};
