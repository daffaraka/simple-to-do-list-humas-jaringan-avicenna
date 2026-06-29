import { Response } from 'express';
import { prisma } from '../index';
import { AuthRequest } from '../middleware/auth';

export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tasks = await prisma.task.findMany({
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
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, documentLink, picId, requestDate, dueDate, priority, columnId, department, labels } = req.body;

    const task = await prisma.task.create({
      data: {
        title,
        description: description || '',
        documentLink,
        picId,
        requestDate: requestDate ? new Date(requestDate) : null,
        dueDate: dueDate ? new Date(dueDate) : null,
        priority: priority || 'low',
        columnId: columnId || 'new',
        department: department || req.user?.department || 'humas',
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
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, documentLink, picId, requestDate, dueDate, priority, columnId, department, position } = req.body;

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
        ...(department && { department }),
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
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.task.delete({ where: { id } });
    res.json({ message: 'Tugas berhasil dihapus' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
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
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};
