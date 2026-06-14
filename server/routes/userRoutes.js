import express from 'express';
import { getUsers, getUser, updateUser, deleteUser, toggleUserActive } from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All user routes require admin access
router.use(protect, authorize('admin'));

router.route('/')
  .get(getUsers);

router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

router.patch('/:id/toggle-active', toggleUserActive);

export default router;
