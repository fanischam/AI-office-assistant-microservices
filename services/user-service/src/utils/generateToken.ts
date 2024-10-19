import { Response } from 'express';
import jwt from 'jsonwebtoken';

const generateToken = (res: Response, userId: string): void => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: '14d',
  });

  const maxAgeValue: number = 14 * 24 * 60 * 60 * 1000;

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: maxAgeValue,
  });
};

export default generateToken;
