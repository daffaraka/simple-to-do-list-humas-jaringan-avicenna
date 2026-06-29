import { Response } from 'express';
import { prisma } from '../index';
import { AuthRequest } from '../middleware/auth';

export const addChecklist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { taskId } = req.params;
    const { text } = req.body;

    if (!text) {
      res.status(400).json({ message: 'Teks ceklis wajib diisi' });
      return;
    }

    const checklist = await prisma.checklist.create({
      data: {
        taskId,
        text,
        completed: false,
      }
    });

    res.status(201).json(checklist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

export const updateChecklist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { completed, text } = req.body;

    const checklist = await prisma.checklist.update({
      where: { id },
      data: {
        ...(completed !== undefined && { completed }),
        ...(text !== undefined && { text }),
      }
    });

    res.json(checklist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

export const deleteChecklist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.checklist.delete({ where: { id } });
    res.json({ message: 'Item ceklis berhasil dihapus' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};
