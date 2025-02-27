import { textToSpeech } from '../middlewares/textToSpeechMiddleware';
import { logout } from '../slices/authSlice';
import { useSendPromptMutation } from '../slices/chatbotApiSlice';
import { NavigateFunction } from 'react-router-dom';
import { formatDate } from './dateUtils';
import { toast } from 'react-toastify';
import { Dispatch } from '@reduxjs/toolkit';
import { Appointment, Message, ProcessUserMessage } from '../types/types';

export const processUserMessage = async ({
  message,
  setMessages,
  sendPrompt,
  dispatch,
  navigate,
}: ProcessUserMessage) => {
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
      const appointments = Array.isArray(response.appointments)
        ? response.appointments
        : response.appointments.appointments || [];

      if (appointments.length === 0) {
        botMessage.text = 'You have no appointments for this period.';
      } else {
        const periodDescription = response.appointments.description
          ? `Here are your ${response.appointments.description}:\n\n`
          : 'Your appointments are:\n\n';

        botMessage.text = periodDescription;

        const appointmentsList = appointments
          .map((appointment: Appointment) => {
            const { title, participant, participantPhoneNumber, date } =
              appointment;
            return `• ${title} appointment with ${participant} on ${formatDate(
              date
            )}.\n  Phone: ${participantPhoneNumber}`;
          })
          .join('\n\n');

        botMessage.text += appointmentsList;
      }
    } else {
      botMessage.text = response.message || response.error || response.response;
    }

    textToSpeech(botMessage.text);

    setMessages((prevMessages) => [...prevMessages, botMessage]);
  } catch (error: any) {
    if (error.originalStatus === 401) {
      dispatch(logout());
      navigate('/');
      toast.info('Token expired, please log in again');
    }

    console.error('Error sending prompt to the backend', error);
    const botMessage: Message = {
      text:
        'There must be something wrong with your appointment details, please make sure that you specify a participant,' +
        "participant's phone number, the reason of the appointment and the date.",
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
