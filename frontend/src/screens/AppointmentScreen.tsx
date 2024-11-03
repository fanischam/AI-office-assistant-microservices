import React, { useState } from 'react';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import {
  useGetAppointmentsQuery,
  useCreateAppointmentMutation,
  useUpdateAppointmentMutation,
  useDeleteAppointmentMutation,
} from '../slices/appointmentApiSlice';
import Loader from '../components/Loader';
import { formatDateForInput } from '../utils/dateUtils';

interface Appointment {
  _id: string;
  title: string;
  participant: string;
  participantPhoneNumber: number;
  date: string;
}

const AppointmentsScreen: React.FC = () => {
  const {
    data: appointments,
    isLoading,
    refetch,
  } = useGetAppointmentsQuery({});
  const [createAppointment] = useCreateAppointmentMutation();
  const [updateAppointment] = useUpdateAppointmentMutation();
  const [deleteAppointment] = useDeleteAppointmentMutation();

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit'>('create');
  const [currentAppointment, setCurrentAppointment] = useState<
    Partial<Appointment>
  >({});

  const handleShowModal = (
    type: 'create' | 'edit',
    appointment?: Appointment
  ) => {
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
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentAppointment({});
  };

  const handleSave = async () => {
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
      refetch();
      handleCloseModal();
    } catch (error: any) {
      toast.error(error.data?.message || 'Error saving appointment');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await deleteAppointment(id).unwrap();
        toast.success('Appointment deleted successfully');
        refetch();
      } catch (error: any) {
        toast.error(error.data?.message || 'Error deleting appointment');
      }
    }
  };

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
            {appointments?.map((appointment: Appointment) => (
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
                    onClick={() => handleDelete(appointment._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
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
