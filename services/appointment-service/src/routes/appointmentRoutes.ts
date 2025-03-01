import express from 'express';
import {
  createAppointment,
  deleteAppointment,
  getAppointmentById,
  getAppointments,
  getAppointmentsByPeriod,
  updateAppointment,
} from '../controllers/appointmentController';
import protect from '../middleware/authMiddleware';

const router = express.Router();

router
  .route('/')
  .get(protect, getAppointments)
  .post(protect, createAppointment);

router.route('/period/:period').get(protect, getAppointmentsByPeriod);

router
  .route('/:id')
  .get(protect, getAppointmentById)
  .put(protect, updateAppointment)
  .delete(protect, deleteAppointment);

export default router;
