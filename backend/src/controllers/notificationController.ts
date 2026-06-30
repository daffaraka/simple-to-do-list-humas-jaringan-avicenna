import { Response } from 'express';
import { prisma } from '../index';
import { AuthRequest } from '../middleware/auth';

export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50 // Limit to 50 most recent
    });

    res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    // Mark all as read if id is 'all'
    if (id === 'all') {
      await prisma.notification.updateMany({
        where: { userId, read: false },
        data: { read: true }
      });
      return res.json({ message: 'All marked as read' });
    }

    const notification = await prisma.notification.findUnique({ where: { id } });
    if (!notification || notification.userId !== userId) {
      return res.status(404).json({ error: 'Not found' });
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { read: true }
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update notification' });
  }
};
