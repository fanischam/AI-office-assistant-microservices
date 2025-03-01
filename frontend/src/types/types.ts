import { NavigateFunction } from 'react-router-dom';
import { Dispatch } from '@reduxjs/toolkit';
import { useSendPromptMutation } from '../slices/chatbotApiSlice';

export interface Message {
  text: string;
  sender: SenderType;
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

export interface UserInfo {
  id: string;
  name: string;
  email: string;
}

export interface AuthState {
  userInfo: UserInfo | null;
}

export interface MessageProps {
  text: string;
  sender: SenderType;
}

export interface InputFieldProps {
  onSendMessage: (message: string) => void;
}

export interface UseVoiceRecorderResponse {
  isRecording: boolean;
  audioUrl: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
}

type SenderType = 'user' | 'bot';

export interface VoiceRecorderProps {
  onAudioRecorded: (audioUrl: string) => void;
}

export interface LogoProps {
  logoSrc: string;
}

export interface FormContainerProps {
  children: React.ReactNode;
}
