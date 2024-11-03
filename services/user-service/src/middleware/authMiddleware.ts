import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import asyncHandler from './asyncHandler';
import User from '../models/userModel';

export interface CustomRequest extends Request {
  user?: typeof User.prototype;
}

const protect = asyncHandler(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    let token;

    if (req.cookies.jwt) {
      token = req.cookies.jwt;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET!
        ) as JwtPayload;

        req.user = await User.findById(decoded.userId).select('-password');

        if (!req.user) {
          res.status(401);
          throw new Error('Not authorized, user not found');
        }

        next();
      } catch (error) {
        console.error(error);
        res.status(401);
        throw new Error('Not authorized, token failed');
      }
    } else {
      res.status(401);
      throw new Error('Not authorized, no token');
    }
  }
);

export default protect;
