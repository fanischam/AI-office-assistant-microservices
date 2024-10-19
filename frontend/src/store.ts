import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { userApiSlice } from './slices/userApiSlice';
import { appointmentApiSlice } from './slices/appointmentApiSlice';
import { chatbotApiSlice } from './slices/chatbotApiSlice';
import authSliceReducer from './slices/authSlice';

const rootReducer = combineReducers({
  [userApiSlice.reducerPath]: userApiSlice.reducer,
  [appointmentApiSlice.reducerPath]: appointmentApiSlice.reducer,
  [chatbotApiSlice.reducerPath]: chatbotApiSlice.reducer,
  auth: authSliceReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userApiSlice.middleware,
      appointmentApiSlice.middleware,
      chatbotApiSlice.middleware
    ),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
