import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import asyncHandler from './asyncHandler';
import axios from 'axios';

export interface CustomRequest extends Request {
  user?: any;
}

const protect = asyncHandler(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    let token;

    token = req.cookies.jwt;

    if (token) {
      try {
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET!
        ) as JwtPayload;

        const { data: user } = await axios.get(
          `${process.env.USER_SERVICE_URL}/api/users/${decoded.userId}`
        );

        if (!user) {
          res.status(401);
          throw new Error('Not authorized, user not found');
        }

        // Attach the user object to the request
        req.user = user;

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
