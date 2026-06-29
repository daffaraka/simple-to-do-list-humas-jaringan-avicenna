import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { getTasks, createTask, updateTask, deleteTask, toggleLabel } from '../controllers/taskController';

const router = Router();
router.use(authenticateToken); // Protect all task routes

router.get('/', getTasks);
router.post('/', createTask);
router.patch('/:id', updateTask);
router.delete('/:id', deleteTask);
router.post('/:id/labels', toggleLabel);

export default router;
