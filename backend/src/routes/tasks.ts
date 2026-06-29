import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
  // TODO: Get all tasks
  res.status(501).json({ message: 'Not implemented' });
});

router.post('/', async (req, res) => {
  // TODO: Create task
  res.status(501).json({ message: 'Not implemented' });
});

router.patch('/:id', async (req, res) => {
  // TODO: Update task
  res.status(501).json({ message: 'Not implemented' });
});

router.delete('/:id', async (req, res) => {
  // TODO: Delete task
  res.status(501).json({ message: 'Not implemented' });
});

export default router;
