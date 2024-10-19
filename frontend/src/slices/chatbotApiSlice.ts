import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CHATBOT_URL } from '../constants';

export const chatbotApiSlice = createApi({
  reducerPath: 'chatbotApi',
  baseQuery: fetchBaseQuery({
    baseUrl: CHATBOT_URL,
    credentials: 'include',
  }),
  tagTypes: ['Chatbot'],
  endpoints: (builder) => ({
    sendPrompt: builder.mutation({
      query: (data) => ({
        url: '/prompt',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useSendPromptMutation } = chatbotApiSlice;
