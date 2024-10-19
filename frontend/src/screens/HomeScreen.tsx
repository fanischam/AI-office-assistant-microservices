import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../types/storeTypes';

const HomePage: React.FC = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth);

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(userInfo ? '/chat' : '/login');
  };

  return (
    <Container className='d-flex flex-column justify-content-center align-items-center text-center mt-5 py-5'>
      <h1 className='my-5'>Welcome to Office Assistant</h1>
      <p className='my-4 w-50'>
        Office Assistant is an AI-powered web application leveraging modern
        technologies like React and TypeScript for the frontend, Node.js and
        TypeScript for the backend, MongoDB for data storage, Docker for
        deployment, and RabbitMQ for messaging. The app functions as an office
        assistant connected to a robot, enabling it to manage Google Calendar
        appointments, including scheduling, and checking upcoming meetings by
        day or week. The robot also allows voice-activated appointment
        check-ins.
      </p>
      <Button variant='dark' size='lg' className='mb-5' onClick={handleClick}>
        {userInfo ? 'Chat Now' : 'Login'}
      </Button>
    </Container>
  );
};

export default HomePage;
