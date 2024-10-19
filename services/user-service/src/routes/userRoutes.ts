import express from 'express';
import {
  deleteUserProfile,
  getAllUsers,
  loginUser,
  logoutUser,
  registerUser,
  updateUserProfile,
} from '../controllers/userController';
import protect from '../middleware/authMiddleware';

const router = express.Router();

router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.route('/').post(registerUser).get(protect, getAllUsers);
router
  .route('/profile')
  .put(protect, updateUserProfile)
  .delete(protect, deleteUserProfile);

export default router;
