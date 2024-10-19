import React from 'react';
import { Message as MessageType } from '../utils/chatUtils';

interface MessageProps {
  text: string;
  sender: MessageType['sender'];
}

const ChatMessage: React.FC<MessageProps> = ({ text, sender }) => {
  return (
    <div
      className={`message d-flex ${
        sender === 'user' ? 'justify-content-end' : 'justify-content-start'
      } mb-2`}
    >
      <div
        className={`p-2 rounded text-white ${
          sender === 'user' ? 'bg-primary' : 'bg-secondary'
        }`}
      >
        <strong>{sender === 'user' ? 'You' : 'Assistant'}:</strong> {text}
      </div>
    </div>
  );
};

export default ChatMessage;
