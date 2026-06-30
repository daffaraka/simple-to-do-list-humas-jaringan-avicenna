import express from 'express';
import { getTasks, createTask, updateTask, deleteTask, toggleLabel, getMyJobs } from '../controllers/taskController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.use(authenticateToken);

router.get('/my-jobs', getMyJobs);
router.get('/', getTasks);
router.post('/', createTask);
router.patch('/:id', updateTask);
router.delete('/:id', deleteTask);
router.post('/:id/labels', toggleLabel);

export default router;
