import React, { useState } from 'react';
import { InputGroup, FormControl, Button } from 'react-bootstrap';
import VoiceRecorder from './VoiceRecorder';
import { speechRecognitionMiddleware } from '../middlewares/speechRecognitionMiddleware';

interface InputFieldProps {
  onSendMessage: (message: string) => void;
}

const ChatInput: React.FC<InputFieldProps> = ({ onSendMessage }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() !== '') {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleAudioRecorded = async (audioUrl: string) => {
    try {
      const response = await fetch(audioUrl);
      const audioBlob = await response.blob();

      const transcript = await speechRecognitionMiddleware({ audioBlob });
      onSendMessage(transcript);
    } catch (error) {
      console.error('Error transcribing audio:', error);
      onSendMessage('Error processing audio message.');
    }
  };

  return (
    <InputGroup className='input-field'>
      <FormControl
        placeholder='Type your message...'
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => (e.key === 'Enter' ? handleSend() : null)}
      />
      <VoiceRecorder onAudioRecorded={handleAudioRecorded} />
      <Button variant='primary' onClick={handleSend}>
        Send
      </Button>
    </InputGroup>
  );
};

export default ChatInput;
