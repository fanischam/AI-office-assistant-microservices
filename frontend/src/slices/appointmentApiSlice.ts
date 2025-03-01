import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { APPOINTMENTS_URL } from '../constants';
import { PaginatedResponse } from '../types/types';

export const appointmentApiSlice = createApi({
  reducerPath: 'appointmentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.APPOINTMENTS_URL,
    credentials: 'include',
  }),
  tagTypes: ['Appointment'],
  endpoints: (builder) => ({
    getAppointments: builder.query<PaginatedResponse, number | void>({
      query: (page = 1) => ({
        url: '/',
        params: {
          page,
          limit: 12,
        },
      }),
    }),
    createAppointment: builder.mutation({
      query: (newAppointment) => ({
        url: '/',
        method: 'POST',
        body: newAppointment,
      }),
    }),
    updateAppointment: builder.mutation({
      query: (data) => ({
        url: `/${data._id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteAppointment: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetAppointmentsQuery,
  useCreateAppointmentMutation,
  useUpdateAppointmentMutation,
  useDeleteAppointmentMutation,
} = appointmentApiSlice;
