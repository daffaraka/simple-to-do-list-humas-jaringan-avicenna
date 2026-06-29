import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { addChecklist, updateChecklist, deleteChecklist } from '../controllers/checklistController';

const router = Router();
router.use(authenticateToken); // Protect all checklist routes

router.post('/:taskId', addChecklist);
router.patch('/:id', updateChecklist);
router.delete('/:id', deleteChecklist);

export default router;
