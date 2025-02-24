import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import asyncHandler from './asyncHandler';
import axios from 'axios';

export interface CustomRequest extends Request {
  user?: any;
}

const protect = asyncHandler(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;

    if (!token) {
      res.status(401);
      throw new Error('Not authorized, no token');
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      req.user = { _id: decoded.userId };

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }
);

export default protect;
