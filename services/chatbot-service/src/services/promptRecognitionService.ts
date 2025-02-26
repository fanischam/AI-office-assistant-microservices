import { getLangChainResponse } from '../middleware/langChainMiddleware';
import { extractAppointmentDetails } from '../utils/appointmentUtils';
import { PERIOD_PATTERNS } from '../utils/constants';
import { createAppointment, getAppointments } from './appointmentService';

export const processAppointmentPrompt = async (
  prompt: string,
  userId: string,
  jwtToken: string
) => {
  const response = await getLangChainResponse(prompt, userId);

  if (
    response.toLowerCase().includes('book appointment') &&
    (prompt.toLowerCase().includes('yes') ||
      prompt.toLowerCase().includes('confirm'))
  ) {
    const appointmentDetails = extractAppointmentDetails(response);
    if (appointmentDetails && !('error' in appointmentDetails)) {
      const { title, participant, participantPhoneNumber, date } =
        appointmentDetails;
      const result = await createAppointment(
        title,
        participant,
        participantPhoneNumber,
        date,
        userId,
        jwtToken
      );

      if ('error' in result) {
        throw new Error(result.error);
      }

      return { message: 'Appointment booked successfully!' };
    } else {
      throw new Error(
        appointmentDetails?.error || 'Failed to extract appointment details.'
      );
    }
  }

  for (const { regex, period, description } of PERIOD_PATTERNS) {
    if (regex.test(prompt)) {
      const appointments = await getAppointments(userId, period, jwtToken);
      return {
        appointments: {
          ...appointments,
          description: description || `appointments for ${period}`,
        },
      };
    }
  }

  return { response };
};
