import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

interface LogoProps {
  logoSrc: string;
}

const Logo: React.FC<LogoProps> = ({ logoSrc }) => {
  return (
    <Container className='d-flex flex-row align-items-center'>
      <Row>
        <Col xs='auto' className='d-flex align-items-center'>
          <img src={logoSrc} alt='Office Assistant Logo' id='logo' />
        </Col>
        <Col className='d-flex align-items-center'>
          <span className='fs-4'>Office Assistant</span>
        </Col>
      </Row>
    </Container>
  );
};

export default Logo;
