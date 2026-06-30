import { Response } from 'express';
import { prisma } from '../index';
import { AuthRequest } from '../middleware/auth';

export const getBoards = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role?.name;
    const departmentId = req.user?.departmentId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const whereClause = userRole === 'Admin' ? {} : { userId };

    const boards = await prisma.board.findMany({
      where: whereClause,
      include: {
        user: true,
        kpi: true,
        tasks: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(boards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch boards' });
  }
};

export const createBoard = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, kpiId } = req.body;
    const userId = req.user?.id;
    const departmentId = req.user?.departmentId;

    if (!userId || !departmentId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const board = await prisma.board.create({
      data: {
        title,
        description,
        userId,
        departmentId,
        kpiId,
      },
      include: {
        kpi: true
      }
    });

    res.status(201).json(board);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create board' });
  }
};

export const updateBoard = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role?.name;
    const { title, description, kpiId } = req.body;

    // Check ownership
    const board = await prisma.board.findUnique({ where: { id } });
    if (!board) return res.status(404).json({ error: 'Board not found' });
    if (userRole !== 'Admin' && board.userId !== userId) return res.status(403).json({ error: 'Forbidden' });

    const updated = await prisma.board.update({
      where: { id },
      data: { title, description, kpiId },
      include: { kpi: true }
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update board' });
  }
};

export const deleteBoard = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role?.name;

    const board = await prisma.board.findUnique({ where: { id } });
    if (!board) return res.status(404).json({ error: 'Board not found' });
    if (userRole !== 'Admin' && board.userId !== userId) return res.status(403).json({ error: 'Forbidden' });

    await prisma.board.delete({ where: { id } });

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete board' });
  }
};
