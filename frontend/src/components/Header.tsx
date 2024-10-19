import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../slices/userApiSlice';
import { RootState } from '../types/storeTypes';
import Logo from './Logo';
import logo from '../assets/logodark.svg';
import { logout } from '../slices/authSlice';
import { toast } from 'react-toastify';

const Header: React.FC = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall({}).unwrap();
      dispatch(logout());
      navigate('/');
      toast.info('Logged out succesfully');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <header>
      <Navbar bg='dark' variant='dark' expand='md' collapseOnSelect>
        <Container>
          <LinkContainer to='/'>
            <Navbar.Brand>
              <Logo logoSrc={logo} />
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='ms-auto'>
              {userInfo ? (
                <>
                  <LinkContainer to='/chat'>
                    <Nav.Link className='me-3 fs-4 text-light'>Chat</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to='/appointments'>
                    <Nav.Link className='me-3 fs-4 text-light'>
                      Appointments
                    </Nav.Link>
                  </LinkContainer>
                  <NavDropdown
                    className='fs-4 text-light'
                    title={userInfo.name}
                  >
                    <LinkContainer to='/profile'>
                      <NavDropdown.Item>Profile</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item onClick={logoutHandler}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <>
                  <LinkContainer to='/login'>
                    <Nav.Link className='me-3 fs-4 text-light'>Login</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to='/register'>
                    <Nav.Link className='me-3 fs-4 text-light'>
                      Register
                    </Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
