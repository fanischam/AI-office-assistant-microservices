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
