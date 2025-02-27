import { NavigateFunction } from 'react-router-dom';
import { Dispatch } from '@reduxjs/toolkit';
import { useSendPromptMutation } from '../slices/chatbotApiSlice';

export interface Message {
  text: string;
  sender: 'user' | 'bot';
}

export interface Appointment {
  title: string;
  participant: string;
  participantPhoneNumber: number;
  date: Date;
}

export interface ProcessUserMessage {
  message: string;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  sendPrompt: ReturnType<typeof useSendPromptMutation>[0];
  dispatch: Dispatch;
  navigate: NavigateFunction;
}
