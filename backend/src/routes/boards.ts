import { Router } from 'express';
import * as boardController from '../controllers/boardController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/', boardController.getBoards);
router.post('/', boardController.createBoard);
router.patch('/:id', boardController.updateBoard);
router.delete('/:id', boardController.deleteBoard);

export default router;
