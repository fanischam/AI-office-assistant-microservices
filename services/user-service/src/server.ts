import express from 'express';
import connectDB from './config/db';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
dotenv.config();

const port = process.env.PORT;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const allowedOrigins = [
  process.env.FRONTEND_SERVICE,
  process.env.FRONTEND_LOCAL,
];

app.use(
  cors({
    origin: (origin: string | undefined, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    allowedHeaders: ['Content-Type', 'Cookie'],
    exposedHeaders: ['Set-Cookie'],
    credentials: true,
  })
);

app.use('/api/users', userRoutes);

app.listen(port, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
});
