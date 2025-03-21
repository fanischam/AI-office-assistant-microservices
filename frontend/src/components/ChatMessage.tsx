import React from 'react';
import { MessageProps } from '../types/types';

const ChatMessage: React.FC<MessageProps> = ({ text, sender }) => {
  const formatText = (text: string) => {
    return text?.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i < text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

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
        <strong>{sender === 'user' ? 'You' : 'Assistant'}:</strong>{' '}
        {formatText(text)}
      </div>
    </div>
  );
};

export default ChatMessage;
