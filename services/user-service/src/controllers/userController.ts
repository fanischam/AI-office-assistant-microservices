import asyncHandler from '../middleware/asyncHandler';
import generateToken from '../utils/generateToken';
import User from '../models/userModel';
import { Request, Response } from 'express';
import { CustomRequest } from '../middleware/authMiddleware';

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).send('User not registered');
  }

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id as string);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    generateToken(res, user._id as string);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  res.clearCookie('jwt');
  res.status(200).json({ message: 'Logged out successfully' });
});

const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await User.find({});
  res.json(users);
});

const updateUserProfile = asyncHandler(async (req: CustomRequest, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      token: generateToken(res, updatedUser._id as string),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const deleteUserProfile = asyncHandler(async (req: CustomRequest, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    await user.deleteOne();
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export {
  loginUser,
  registerUser,
  logoutUser,
  getAllUsers,
  updateUserProfile,
  deleteUserProfile,
};
