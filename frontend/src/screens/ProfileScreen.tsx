/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Form, Button, Row, Col, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import {
  useProfileMutation,
  useDeleteProfileMutation,
} from '../slices/userApiSlice';
import { logout, setCredentials } from '../slices/authSlice';
import { RootState } from '../types/storeTypes';
import { PASSWORD_REGEX } from '../constants';
import { AiOutlineExclamationCircle } from 'react-icons/ai';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  const { userInfo } = useSelector((state: RootState) => state.auth);

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();
  const [deleteProfile, { isLoading: isDeleting }] = useDeleteProfileMutation();

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
  }, [userInfo, userInfo?.email, userInfo?.name]);

  const dispatch = useDispatch();

  const submitHandler = async (e: any) => {
    e.preventDefault();

    if (!PASSWORD_REGEX.test(password)) {
      toast.error(
        'Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one digit, and one special character.'
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    } else {
      try {
        const res = await updateProfile({
          name,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success('Profile updated successfully');
        setShowUpdateModal(false);
      } catch (error: any) {
        if (error.originalStatus === 401) {
          dispatch(logout());
          navigate('/login');
          toast.error('Session expired. Please login again');
        } else {
          toast.error('An error occured');
          console.error(error?.data || 'An error occurred');
        }
      }
    }
  };

  const handleDeleteClick = async () => {
    try {
      await deleteProfile({ id: userInfo?.id }).unwrap();
      dispatch(logout());
      navigate('/login');
      toast.success('Profile deleted successfully');
      setShowDeleteModal(false);
    } catch (error: any) {
      if (error.originalStatus === 401) {
        dispatch(logout());
        navigate('/login');
        toast.error('Session expired. Please login again');
      } else {
        toast.error('An error occured');
        console.error(error?.data || 'An error occurred');
      }
    }
  };

  return (
    <Row className=' mx-auto'>
      <Col xs={12} md={6} className='mx-auto my-5 '>
        <h2>User Profile</h2>

        <Form
          onSubmit={(e) => {
            e.preventDefault();
            setShowUpdateModal(true);
          }}
        >
          <Form.Group className='my-2' controlId='name'>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group className='my-2' controlId='email'>
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type='email'
              placeholder='Enter email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group className='my-2' controlId='password'>
            <Form.Label>
              Password
              <span className='password-tooltip ml-3'>
                <AiOutlineExclamationCircle />
                <span className='tooltip-text'>
                  Password must be at least 8 characters long, include one
                  uppercase letter, one lowercase letter, one digit, and one
                  special character.
                </span>
              </span>
            </Form.Label>
            <Form.Control
              type='password'
              placeholder='Enter password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group className='my-2' controlId='confirmPassword'>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Confirm password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <div className='d-flex justify-content-between my-4'>
            <Button
              type='submit'
              variant='dark'
              disabled={loadingUpdateProfile}
            >
              {loadingUpdateProfile ? <Loader /> : 'Update Profile'}
            </Button>
            <Button
              variant='danger'
              onClick={() => setShowDeleteModal(true)}
              disabled={isDeleting}
            >
              {isDeleting ? <Loader /> : 'Delete Account'}
            </Button>
          </div>
        </Form>

        {/* Update Confirmation Modal */}
        <Modal
          show={showUpdateModal}
          onHide={() => setShowUpdateModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirm Update</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to update your profile with the new details?
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant='secondary'
              onClick={() => setShowUpdateModal(false)}
            >
              Cancel
            </Button>
            <Button variant='primary' onClick={submitHandler}>
              Confirm Update
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete your account? This action cannot be
            undone.
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant='secondary'
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button variant='danger' onClick={handleDeleteClick}>
              Confirm Deletion
            </Button>
          </Modal.Footer>
        </Modal>
      </Col>
    </Row>
  );
};

export default ProfileScreen;
