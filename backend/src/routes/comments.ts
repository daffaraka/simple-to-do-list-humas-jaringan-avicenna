import express from 'express';
import { getComments, createComment } from '../controllers/commentController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router({ mergeParams: true }); // mergeParams to get taskId from parent route

router.use(authenticateToken);

router.get('/', getComments);
router.post('/', createComment);

export default router;
