import { Router } from 'express';

const router = Router();

router.post('/register', async (req, res) => {
  // TODO: Implement register
  res.status(501).json({ message: 'Not implemented' });
});

router.post('/login', async (req, res) => {
  // TODO: Implement login
  res.status(501).json({ message: 'Not implemented' });
});

router.get('/me', async (req, res) => {
  // TODO: Implement get current user
  res.status(501).json({ message: 'Not implemented' });
});

export default router;
