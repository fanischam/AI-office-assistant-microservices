import { parseRelativeDate } from '../utils/dateUtils';
import axios from 'axios';

const extractAppointmentDetails = (response: string) => {
  const match = response.match(
    /- Appointment with:\s*(.+)\n- Purpose:\s*(.+)\n- Date:\s*(.+)\n- Time:\s*(.+)\n- Contact Number:\s*(\d+)/
  );

  if (!match) {
    return {
      error:
        "Unable to extract appointment details. Please provide the purpose of the appointment, the participant, the participant's phone number and the date.",
    };
  }

  const [
    _,
    participant,
    purpose,
    dateString,
    timeString,
    participantPhoneNumber,
  ] = match;

  const date = parseRelativeDate(dateString, timeString);

  if (!purpose.trim()) {
    return { error: 'Please specify the purpose of the appointment.' };
  }

  if (participantPhoneNumber.length !== 10) {
    return { error: 'Phone number must have 10 digits.' };
  }

  if (!date) {
    return {
      error:
        'Invalid date format. Please specify a date like Monday 18th of August at 7 am.',
    };
  }

  const title = purpose;

  return {
    title,
    participant,
    participantPhoneNumber: parseInt(participantPhoneNumber, 10),
    date,
  };
};

const createAppointment = async (
  title: string,
  participant: string,
  participantPhoneNumber: number,
  date: Date,
  userId: string,
  jwtToken: string
) => {
  try {
    const response = await axios.post(
      `${process.env.APPOINTMENT_SERVICE_URL}/api/appointments`,
      {
        title,
        participant,
        participantPhoneNumber,
        date,
        user: userId,
      },
      {
        headers: {
          Cookie: `jwt=${jwtToken}`,
        },
        withCredentials: true,
      }
    );
    return {
      message: 'Appointment created successfully',
      appointment: response.data,
    };
  } catch (error: any) {
    console.error('Error booking appointment:', error);
    return {
      error:
        error.response?.data?.message ||
        'An unknown error occurred while booking the appointment.',
    };
  }
};

const getAppointments = async (
  userId: string,
  period: string,
  jwtToken: string
) => {
  try {
    const response = await axios.get(
      `${process.env.APPOINTMENT_SERVICE_URL}/api/appointments`,
      {
        headers: {
          Cookie: `jwt=${jwtToken}`,
        },
        params: {
          userId,
          period,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching appointments for ${period}:`, error);
    return [];
  }
};

export { extractAppointmentDetails, createAppointment, getAppointments };
