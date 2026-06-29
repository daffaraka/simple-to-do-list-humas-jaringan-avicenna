import { Router } from 'express';
import * as roleController from '../controllers/roleController';
import { authenticateToken, authorizeAdmin } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);
router.use(authorizeAdmin); // Only admin can access roles

router.get('/', roleController.getRoles);
router.post('/', roleController.createRole);
router.patch('/:id', roleController.updateRole);
router.delete('/:id', roleController.deleteRole);

export default router;
