import express from 'express';
import { getKpis, createKpi, updateKpi, deleteKpi } from '../controllers/kpiController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getKpis);
router.post('/', createKpi);
router.put('/:id', updateKpi);
router.delete('/:id', deleteKpi);

export default router;
