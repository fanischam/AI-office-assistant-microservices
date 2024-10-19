import { Request, Response } from 'express';
import asyncHandler from '../middleware/asyncHandler';
import Appointment from '../models/appointmentModel';
import { CustomRequest } from '../middleware/authMiddleware';

const getAppointments = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const userId = req.user._id;
    const appointments = await Appointment.find({ user: userId });
    res.json(appointments);
  }
);

const getAppointmentById = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const userId = req.user._id;
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      user: userId,
    });
    if (appointment) {
      res.json(appointment);
    } else {
      res.status(404).json({ message: 'Appointment not found' });
    }
  }
);

const createAppointment = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const userId = req.user._id;
    const { title, participant, participantPhoneNumber, date } = req.body;

    const appointExists = await Appointment.findOne({ date, user: userId });

    if (appointExists) {
      res.status(400).json({
        message: 'An appointment already exists for this date',
      });
      return;
    }

    const appointment = await Appointment.create({
      title,
      participant,
      participantPhoneNumber,
      date,
      user: userId,
    });

    if (appointment) {
      res.status(201).json({
        _id: appointment._id,
        title: appointment.title,
        participant: appointment.participant,
        participantPhoneNumber: appointment.participantPhoneNumber,
        date: appointment.date,
        user: appointment.user,
      });
    } else {
      res.status(400).json({ message: 'Invalid appointment data' });
    }
  }
);

const createAppointmentDirect = async (
  title: string,
  participant: string,
  participantPhoneNumber: number,
  date: Date,
  userId: string
) => {
  const appointExists = await Appointment.findOne({ date, user: userId });

  if (appointExists) {
    console.error('Appointment already exists for this date:', date);
    throw new Error('An appointment already exists for this date');
  }

  const appointment = await Appointment.create({
    title,
    participant,
    participantPhoneNumber,
    date,
    user: userId,
  });

  if (appointment) {
    return {
      _id: appointment._id,
      title: appointment.title,
      participant: appointment.participant,
      participantPhoneNumber: appointment.participantPhoneNumber,
      date: appointment.date,
      user: appointment.user,
    };
  } else {
    console.error('Failed to create appointment with provided data:', {
      title,
      participant,
      participantPhoneNumber,
      date,
    });
    throw new Error('Invalid appointment data');
  }
};

const updateAppointment = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const userId = req.user._id;
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      user: userId,
    });

    if (appointment) {
      appointment.title = req.body.title || appointment.title;
      appointment.participant = req.body.participant || appointment.participant;
      appointment.participantPhoneNumber =
        req.body.participantPhoneNumber || appointment.participantPhoneNumber;
      appointment.date = req.body.date || appointment.date;

      const updatedAppointment = await appointment.save();

      res.json({
        _id: updatedAppointment._id,
        participant: updatedAppointment.participant,
        participantPhoneNumber: updatedAppointment.participantPhoneNumber,
        date: updatedAppointment.date,
        user: updatedAppointment.user,
      });
    } else {
      res.status(404).json({ message: 'Appointment not found' });
    }
  }
);

const deleteAppointment = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const userId = req.user._id;
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      user: userId,
    });

    if (appointment) {
      await Appointment.deleteOne({ _id: appointment._id });
      res.json({ message: 'Appointment deleted' });
    } else {
      res.status(404).json({ message: 'Appointment not found' });
    }
  }
);

export {
  getAppointments,
  getAppointmentById,
  createAppointment,
  createAppointmentDirect,
  updateAppointment,
  deleteAppointment,
};
