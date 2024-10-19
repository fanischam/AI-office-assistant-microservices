import { textToSpeech } from '../middlewares/textToSpeechMiddleware';
import { useSendPromptMutation } from '../slices/chatbotApiSlice';
import { formatDate } from './dateUtils';

export interface Message {
  text: string;
  sender: 'user' | 'bot';
}

interface Appointment {
  title: string;
  participant: string;
  participantPhoneNumber: number;
  date: Date;
}

export const processUserMessage = async (
  message: string,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  sendPrompt: ReturnType<typeof useSendPromptMutation>[0]
) => {
  if (!message) return;

  const userMessage: Message = { text: message, sender: 'user' };
  setMessages((prevMessages) => [...prevMessages, userMessage]);

  try {
    const response = await sendPrompt({ prompt: message }).unwrap();

    let botMessage: Message = {
      text: 'You have no appointments',
      sender: 'bot',
    };

    if (response.appointments) {
      botMessage.text = 'Your appointments are: ';
      const appointments = response.appointments;
      appointments.forEach((appointment: Appointment) => {
        const { title, participant, participantPhoneNumber, date } =
          appointment;
        botMessage.text += `${title} appointment with ${participant} on ${formatDate(
          date
        )}. ${participant}'s contact phone number is ${participantPhoneNumber}.`;
      });
    } else {
      botMessage.text = response.message || response.error || response.response;
    }

    textToSpeech(botMessage.text);

    setMessages((prevMessages) => [...prevMessages, botMessage]);
  } catch (error: any) {
    console.error('Error sending prompt to the backend', error);
    const botMessage: Message = {
      text:
        error.message ||
        'There must be something wrong with your appointment details, please make sure that you specify a participant, his phone number, the reason of the appointment and the date in a format like Tuesday 20th of August at 11:00.',
      sender: 'bot',
    };

    if (error?.data?.error) {
      botMessage.text = error.data.error;
      textToSpeech(error.data.error);
    } else if (error?.data?.message) {
      botMessage.text = error.data.message;
      textToSpeech(error.data.message);
    }

    setMessages((prevMessages) => [...prevMessages, botMessage]);
  }
};
