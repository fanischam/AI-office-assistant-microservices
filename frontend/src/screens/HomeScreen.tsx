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
        This application functions as a comprehensive office assistant. It uses
        a React and TypeScript frontend that displays a chatbot interface where
        users can interact with an AI-powered assistant. On the backend,
        microservices in Node.js manage various features, including appointment
        scheduling, Google Calendar integration, and user authentication. The
        frontend includes a Home screen that checks if a user is logged in or
        not (looking for a valid JWT stored in a secure cookie), a Chat screen
        where the user can send prompts or queries to the AI bot, and an
        Appointment screen for viewing, creating, updating, and deleting
        appointments. Users receive real-time responses from the chatbot, which
        can also perform text-to-speech conversion, handle voice commands via
        speech recognition, and display upcoming meetings or tasks. JWT
        authentication is handled server-side with an HttpOnly cookie to protect
        the token, while client-side code uses RTK Query (or fetch/axios) to
        make calls. If a 401 error occurs, the app dispatches a logout action
        and redirects to the login screen. Docker and RabbitMQ are employed for
        deployment and messaging among services, allowing the system to remain
        scalable. Overall, the app provides a single interface for scheduling,
        managing, and checking appointments, alongside an interactive AI
        assistant that can respond to text or voice, making office tasks more
        streamlined and efficient.
      </p>
      <Button variant='dark' size='lg' className='mb-5' onClick={handleClick}>
        {userInfo ? 'Chat Now' : 'Login'}
      </Button>
    </Container>
  );
};

export default HomePage;
