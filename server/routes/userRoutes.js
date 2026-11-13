import { Router } from 'express';
import { getMe, updateMe } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = Router();
router.use(protect);
router.get('/me', getMe);
router.put('/update', updateMe);
export default router;
