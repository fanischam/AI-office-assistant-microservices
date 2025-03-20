import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Table, Button, Form, Modal, Pagination } from 'react-bootstrap';
import { toast } from 'react-toastify';
import {
  useGetAppointmentsQuery,
  useCreateAppointmentMutation,
  useUpdateAppointmentMutation,
  useDeleteAppointmentMutation,
} from '../slices/appointmentApiSlice';
import Loader from '../components/Loader';
import { formatDateForInput } from '../utils/dateUtils';
import { Appointment } from '../types/types';
import { logout } from '../slices/authSlice';

const AppointmentsScreen: React.FC = () => {
  const [page, setPage] = useState(1);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    data: paginatedData,
    isLoading,
    error,
  } = useGetAppointmentsQuery(page, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  const handleError = useCallback(
    async (error: any) => {
      try {
        if (error.originalStatus === 401) {
          dispatch(logout());
          navigate('/login');
          toast.error('Invalid session. Please login again');
        } else {
          toast.error('An error occured');
          console.error(error?.data || 'An error occurred');
        }
      } catch (error) {
        console.error(error);
      }
    },
    [dispatch, navigate]
  );

  useEffect(() => {
    if (error) {
      console.log('Error:', error);
      handleError(error);
    }
  }, [error, handleError]);

  const [createAppointment] = useCreateAppointmentMutation();
  const [updateAppointment] = useUpdateAppointmentMutation();
  const [deleteAppointment] = useDeleteAppointmentMutation();

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit'>('create');
  const [currentAppointment, setCurrentAppointment] = useState<
    Partial<Appointment>
  >({});

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleShowModal = useCallback(
    (type: 'create' | 'edit', appointment?: Appointment) => {
      setModalType(type);
      setCurrentAppointment(
        appointment
          ? {
              ...appointment,
              date: formatDateForInput(appointment.date),
            }
          : {}
      );
      setShowModal(true);
    },
    []
  );

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setCurrentAppointment({});
  }, []);

  const handleSave = useCallback(async () => {
    const { title, participant, participantPhoneNumber, date } =
      currentAppointment;

    if (!title || !participant || !participantPhoneNumber || !date) {
      toast.error('All fields are required');
      return;
    }

    if (participantPhoneNumber.toString().length !== 10) {
      toast.error('Phone number must be exactly 10 digits');
      return;
    }

    try {
      if (modalType === 'create') {
        await createAppointment(currentAppointment).unwrap();
        toast.success('Appointment created successfully');
      } else {
        await updateAppointment(currentAppointment).unwrap();
        toast.success('Appointment updated successfully');
      }
      handleCloseModal();
    } catch (error: any) {
      toast.error(error.data?.message || 'Error saving appointment');
    }
  }, [
    currentAppointment,
    modalType,
    handleCloseModal,
    createAppointment,
    updateAppointment,
  ]);

  const handleDelete = useCallback(
    async (id: string) => {
      if (window.confirm('Are you sure you want to delete this appointment?')) {
        try {
          await deleteAppointment(id).unwrap();
          toast.success('Appointment deleted successfully');
        } catch (error: any) {
          toast.error(error.data?.message || 'Error deleting appointment');
        }
      }
    },
    [deleteAppointment]
  );

  return (
    <>
      <h1>Appointments</h1>
      <Button variant='dark' onClick={() => handleShowModal('create')}>
        Create Appointment
      </Button>

      {isLoading ? (
        <Loader />
      ) : (
        <Table striped bordered hover className='mt-3'>
          <thead>
            <tr>
              <th>Title</th>
              <th>Participant</th>
              <th>Phone Number</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData?.appointments?.map((appointment: Appointment) => (
              <tr key={appointment._id}>
                <td>{appointment.title}</td>
                <td>{appointment.participant}</td>
                <td>{appointment.participantPhoneNumber}</td>
                <td>{new Date(appointment.date).toLocaleString()}</td>
                <td>
                  <Button
                    variant='info'
                    className='mx-2'
                    onClick={() => handleShowModal('edit', appointment)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant='danger'
                    onClick={() => handleDelete(appointment._id!)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {!isLoading && paginatedData && (
        <div className='d-flex justify-content-center mt-4'>
          <Pagination>
            <Pagination.First
              onClick={() => handlePageChange(1)}
              disabled={paginatedData.currentPage === 1}
            />
            <Pagination.Prev
              onClick={() => handlePageChange(paginatedData.currentPage - 1)}
              disabled={paginatedData.currentPage === 1}
            />

            {[...Array(paginatedData.totalPages)].map((_, idx) => (
              <Pagination.Item
                key={idx + 1}
                active={idx + 1 === paginatedData.currentPage}
                onClick={() => handlePageChange(idx + 1)}
              >
                {idx + 1}
              </Pagination.Item>
            ))}

            <Pagination.Next
              onClick={() => handlePageChange(paginatedData.currentPage + 1)}
              disabled={paginatedData.currentPage === paginatedData.totalPages}
            />
            <Pagination.Last
              onClick={() => handlePageChange(paginatedData.totalPages)}
              disabled={paginatedData.currentPage === paginatedData.totalPages}
            />
          </Pagination>
        </div>
      )}

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === 'create' ? 'Create Appointment' : 'Edit Appointment'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId='title'>
              <Form.Label>Title *</Form.Label>
              <Form.Control
                type='text'
                value={currentAppointment.title || ''}
                onChange={(e) =>
                  setCurrentAppointment({
                    ...currentAppointment,
                    title: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId='participant' className='mt-2'>
              <Form.Label>Participant *</Form.Label>
              <Form.Control
                type='text'
                value={currentAppointment.participant || ''}
                onChange={(e) =>
                  setCurrentAppointment({
                    ...currentAppointment,
                    participant: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId='participantPhoneNumber' className='mt-2'>
              <Form.Label>Phone Number *</Form.Label>
              <Form.Control
                type='text'
                value={
                  currentAppointment.participantPhoneNumber?.toString() || ''
                }
                onChange={(e) => {
                  const phoneNumber = parseInt(e.target.value, 10);
                  setCurrentAppointment({
                    ...currentAppointment,
                    participantPhoneNumber: isNaN(phoneNumber)
                      ? undefined
                      : phoneNumber,
                  });
                }}
              />
            </Form.Group>
            <Form.Group controlId='date' className='mt-2'>
              <Form.Label>Date *</Form.Label>
              <Form.Control
                type='datetime-local'
                value={currentAppointment.date || ''}
                onChange={(e) =>
                  setCurrentAppointment({
                    ...currentAppointment,
                    date: e.target.value,
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant='dark' onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AppointmentsScreen;
