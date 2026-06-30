import { Response } from 'express';
import { prisma } from '../index';
import { AuthRequest } from '../middleware/auth';

export const getComments = async (req: AuthRequest, res: Response) => {
  try {
    const { taskId } = req.params;
    const comments = await prisma.comment.findMany({
      where: { taskId },
      include: {
        user: { select: { id: true, name: true, role: true } }
      },
      orderBy: { createdAt: 'asc' }
    });
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

export const createComment = async (req: AuthRequest, res: Response) => {
  try {
    const { taskId } = req.params;
    const { text, mentions } = req.body;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const comment = await prisma.comment.create({
      data: {
        text,
        taskId,
        userId
      },
      include: {
        user: { select: { id: true, name: true, role: true } }
      }
    });

    // Create notifications for mentioned users
    if (mentions && Array.isArray(mentions)) {
      const task = await prisma.task.findUnique({ where: { id: taskId }, include: { board: true } });
      const senderName = req.user?.name || 'Seseorang';
      
      const notifications = mentions.map((mentionedUserId: string) => ({
        userId: mentionedUserId,
        title: 'Anda di-mention dalam sebuah komentar',
        message: `${senderName} menyebut Anda di tugas "${task?.title}" pada proyek "${task?.board?.title}".`,
        link: `/board/${task?.boardId}?taskId=${taskId}`
      }));
      
      if (notifications.length > 0) {
        await prisma.notification.createMany({ data: notifications });
      }
    }

    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
};
