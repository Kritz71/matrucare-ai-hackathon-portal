import { Router } from 'express';
import { createRegistration, getMyEntry, deleteMyEntry } from '../controllers/hackathonController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = Router();
router.use(protect);
router.post('/register', createRegistration);
router.get('/my-entry', getMyEntry);
router.delete('/:id', deleteMyEntry);
export default router;
