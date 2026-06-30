import { Response } from 'express';
import { prisma } from '../index';
import { AuthRequest } from '../middleware/auth';

export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { boardId } = req.query;

    const tasks = await prisma.task.findMany({
      where: boardId ? { boardId: boardId as string } : {},
      include: {
        pic: { select: { name: true, email: true } },
        checklists: true,
        labels: true,
      },
      orderBy: { position: 'asc' },
    });
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error instanceof Error ? error.message : String(error), error: process.env.NODE_ENV !== 'production' ? error : undefined });
  }
};

export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, documentLink, picId, requestDate, dueDate, priority, columnId, departmentId, labels, boardId } = req.body;

    const task = await prisma.task.create({
      data: {
        title,
        description: description || '',
        documentLink,
        picId: req.user?.id,
        requestDate: requestDate ? new Date(requestDate) : null,
        dueDate: dueDate ? new Date(dueDate) : null,
        priority: priority || 'low',
        columnId: columnId || 'new',
        departmentId: req.user?.departmentId!,
        boardId: boardId,
        labels: labels ? {
          create: labels.map((labelId: string) => ({ labelId }))
        } : undefined
      },
      include: {
        pic: { select: { name: true, email: true } },
        checklists: true,
        labels: true,
      }
    });

    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error instanceof Error ? error.message : String(error), error: process.env.NODE_ENV !== 'production' ? error : undefined });
  }
};

export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, documentLink, picId, requestDate, dueDate, priority, columnId, departmentId, position } = req.body;

    const task = await prisma.task.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(documentLink !== undefined && { documentLink }),
        ...(picId !== undefined && { picId }),
        ...(requestDate !== undefined && { requestDate: requestDate ? new Date(requestDate) : null }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
        ...(priority && { priority }),
        ...(columnId && { columnId }),
        ...(departmentId && { departmentId }),
        ...(position !== undefined && { position }),
      },
      include: {
        pic: { select: { name: true, email: true } },
        checklists: true,
        labels: true,
      }
    });

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error instanceof Error ? error.message : String(error), error: process.env.NODE_ENV !== 'production' ? error : undefined });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.task.delete({ where: { id } });
    res.json({ message: 'Tugas berhasil dihapus' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error instanceof Error ? error.message : String(error), error: process.env.NODE_ENV !== 'production' ? error : undefined });
  }
};

export const toggleLabel = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { labelId } = req.body;

    const existingLabel = await prisma.taskLabel.findUnique({
      where: {
        taskId_labelId: { taskId: id, labelId }
      }
    });

    if (existingLabel) {
      await prisma.taskLabel.delete({
        where: { id: existingLabel.id }
      });
      res.json({ message: 'Label removed', added: false });
    } else {
      await prisma.taskLabel.create({
        data: { taskId: id, labelId }
      });
      res.json({ message: 'Label added', added: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error instanceof Error ? error.message : String(error), error: process.env.NODE_ENV !== 'production' ? error : undefined });
  }
};

export const getMyJobs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const tasks = await prisma.task.findMany({
      where: { picId: userId },
      include: {
        pic: { select: { name: true, email: true } },
        checklists: true,
        labels: true,
        board: { select: { title: true, kpi: { select: { title: true } } } }
      },
      orderBy: { requestDate: 'desc' },
    });
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error instanceof Error ? error.message : String(error), error: process.env.NODE_ENV !== 'production' ? error : undefined });
  }
};
