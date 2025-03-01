import { NavigateFunction } from 'react-router-dom';
import { Dispatch } from '@reduxjs/toolkit';
import { useSendPromptMutation } from '../slices/chatbotApiSlice';

export interface Message {
  text: string;
  sender: 'user' | 'bot';
}

export interface Appointment {
  _id?: string;
  title: string;
  participant: string;
  participantPhoneNumber: number;
  date: string;
  user?: string;
}

export interface PaginatedResponse {
  appointments: Appointment[];
  currentPage: number;
  totalPages: number;
  totalAppointments: number;
}

export interface ProcessUserMessage {
  message: string;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  sendPrompt: ReturnType<typeof useSendPromptMutation>[0];
  dispatch: Dispatch;
  navigate: NavigateFunction;
}
