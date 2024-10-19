import React, { useEffect } from 'react';
import ChatWindow from '../components/ChatWindow';
import { Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../types/storeTypes';

const ChatScreen: React.FC = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth);

  const navigate = useNavigate();
  useEffect(() => {
    navigate(userInfo ? '/chat' : '/login');
  }, [userInfo]);

  return (
    <Container className='chat d-flex flex-column justify-content-center align-items-center my-5'>
      <ChatWindow />
    </Container>
  );
};

export default ChatScreen;
