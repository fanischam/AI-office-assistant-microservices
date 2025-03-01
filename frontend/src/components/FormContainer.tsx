import { Container, Row, Col } from 'react-bootstrap';
import { FormContainerProps } from '../types/types';

const FormContainer: React.FC<FormContainerProps> = ({ children }) => {
  return (
    <Container style={{ height: '70vh' }}>
      <Row className='justify-content-md-center'>
        <Col xs={12} md={6}>
          {children}
        </Col>
      </Row>
    </Container>
  );
};

export default FormContainer;
