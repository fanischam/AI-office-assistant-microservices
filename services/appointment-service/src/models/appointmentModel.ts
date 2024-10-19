import mongoose, { Document } from 'mongoose';

interface IAppointment extends Document {
  title: string;
  participant: string;
  participantPhoneNumber: number;
  date: Date;
  user: string;
}

const appointmentSchema = new mongoose.Schema<IAppointment>(
  {
    title: {
      type: String,
      required: true,
    },
    participant: {
      type: String,
      required: true,
    },
    participantPhoneNumber: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Appointment = mongoose.model<IAppointment>(
  'Appointment',
  appointmentSchema
);

export default Appointment;
