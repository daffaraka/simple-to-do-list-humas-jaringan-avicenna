import { Router } from 'express';
import * as departmentController from '../controllers/departmentController';
import { authenticateToken, authorizeAdmin } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

// GET is accessible to everyone so they can select departments
router.get('/', departmentController.getDepartments);

// But mutations only for admin
router.post('/', authorizeAdmin, departmentController.createDepartment);
router.patch('/:id', authorizeAdmin, departmentController.updateDepartment);
router.delete('/:id', authorizeAdmin, departmentController.deleteDepartment);

export default router;
