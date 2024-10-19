import React, { useEffect, useRef, useCallback } from 'react';
import { Button } from 'react-bootstrap';
import { FaMicrophone, FaStop } from 'react-icons/fa';
import useVoiceRecorder from '../hooks/useVoiceRecorder';

interface VoiceRecorderProps {
  onAudioRecorded: (audioUrl: string) => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onAudioRecorded }) => {
  const { isRecording, audioUrl, startRecording, stopRecording } =
    useVoiceRecorder();

  const lastAudioUrl = useRef<string | null>(null);

  const handleVoiceRecording = useCallback(() => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  useEffect(() => {
    if (audioUrl && audioUrl !== lastAudioUrl.current) {
      lastAudioUrl.current = audioUrl;
      onAudioRecorded(audioUrl);
    }
  }, [audioUrl, onAudioRecorded]);

  return (
    <Button variant='secondary' onClick={handleVoiceRecording}>
      {isRecording ? <FaStop /> : <FaMicrophone />}
    </Button>
  );
};

export default VoiceRecorder;
