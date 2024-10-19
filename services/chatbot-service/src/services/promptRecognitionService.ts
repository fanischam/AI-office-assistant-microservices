import { getGPTResponse } from '../middleware/openaiMiddleware';
import {
  extractAppointmentDetails,
  createAppointment,
  getAppointments,
} from './appointmentService';

export const processAppointmentPrompt = async (
  prompt: string,
  userId: string,
  jwtToken: string
) => {
  const gptResponse = await getGPTResponse(prompt);

  if (gptResponse.toLowerCase().includes('book appointment')) {
    const appointmentDetails = extractAppointmentDetails(gptResponse);
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

  const periodMapping = [
    { keywords: ['appointments', 'today'], period: 'today' },
    { keywords: ['appointments', 'tomorrow'], period: 'tomorrow' },
    { keywords: ['appointments', 'this', 'week'], period: 'this-week' },
    { keywords: ['appointments', 'next', 'week'], period: 'next-week' },
  ];

  const includesKeywords = (keywords: string[], text: string) => {
    return keywords.every((keyword) => text.toLowerCase().includes(keyword));
  };

  for (const { keywords, period } of periodMapping) {
    if (includesKeywords(keywords, prompt)) {
      const appointments = await getAppointments(userId, period, jwtToken);
      return { appointments };
    }
  }

  return {
    response:
      'My purpose is only to book new appointments for you and provide you with details about your appointments for today, tomorrow, this week, or next week. For now, I do not have other functionalities.',
  };
};
