import { Response } from 'express';
import { prisma } from '../index';
import { AuthRequest } from '../middleware/auth';

export const getBoards = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const department = req.user?.department;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const boards = await prisma.board.findMany({
      where: {
        userId: userId // "board di kerjakan oleh per user/orang"
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
    const { title, description } = req.body;
    const userId = req.user?.id;
    const department = req.user?.department;

    if (!userId || !department) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const board = await prisma.board.create({
      data: {
        title,
        description,
        userId,
        department: department as any,
      },
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
    const { title, description } = req.body;

    // Check ownership
    const board = await prisma.board.findUnique({ where: { id } });
    if (!board) return res.status(404).json({ error: 'Board not found' });
    if (board.userId !== userId) return res.status(403).json({ error: 'Forbidden' });

    const updated = await prisma.board.update({
      where: { id },
      data: { title, description },
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

    const board = await prisma.board.findUnique({ where: { id } });
    if (!board) return res.status(404).json({ error: 'Board not found' });
    if (board.userId !== userId) return res.status(403).json({ error: 'Forbidden' });

    await prisma.board.delete({ where: { id } });

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete board' });
  }
};
