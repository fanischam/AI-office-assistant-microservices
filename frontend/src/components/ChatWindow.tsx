import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { Card } from 'react-bootstrap';
import { processUserMessage } from '../utils/chatUtils';
import { useSendPromptMutation } from '../slices/chatbotApiSlice';
import { useDispatch } from 'react-redux';
import { Message } from '../types/types';

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sendPrompt] = useSendPromptMutation();

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (messages.length == 0) return;
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (message: string) => {
    processUserMessage(message, setMessages, sendPrompt, dispatch, navigate);
  };

  return (
    <Card className='chat-window w-75 shadow-lg'>
      <Card.Body
        className='message-container overflow-auto p-3'
        style={{ height: '70vh' }}
      >
        {messages.map((msg, index) => (
          <ChatMessage key={index} text={msg.text} sender={msg.sender} />
        ))}
        <div ref={messagesEndRef} />
      </Card.Body>
      <Card.Footer>
        <ChatInput onSendMessage={handleSendMessage} />
      </Card.Footer>
    </Card>
  );
};

export default ChatWindow;
