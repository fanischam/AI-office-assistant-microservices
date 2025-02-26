import axios from 'axios';

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
      `${process.env.APPOINTMENT_SERVICE_URL}/api/appointments/period/${period}`,
      {
        headers: {
          Cookie: `jwt=${jwtToken}`,
        },
        params: {
          userId,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching appointments for ${period}:`, error);
    return [];
  }
};

export { createAppointment, getAppointments };
