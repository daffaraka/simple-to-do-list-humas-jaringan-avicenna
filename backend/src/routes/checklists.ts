import { Router } from 'express';

const router = Router();

router.post('/:taskId', async (req, res) => {
  // TODO: Add checklist item
  res.status(501).json({ message: 'Not implemented' });
});

router.patch('/:id', async (req, res) => {
  // TODO: Toggle checklist item
  res.status(501).json({ message: 'Not implemented' });
});

router.delete('/:id', async (req, res) => {
  // TODO: Delete checklist item
  res.status(501).json({ message: 'Not implemented' });
});

export default router;
