import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '@src/models/user.model';

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export const createUser = async (req, res) => {
  const email = req.body.email;
  const isUserExists = await User.findOne({ email });
  if (isUserExists)
    return res.status(400).json({
      message: 'User already exists',
      success: false,
    });
  const passwordHash = await bcrypt.hash(req.body.password, 10);
  const newUser = await User.create({ ...req.body, password: passwordHash });
  return res.status(201).json({
    message: 'User created successfully',
    token: generateToken(newUser._id),
    success: true,
  });
};

export const getAllUsers = async (req, res) => {
  const users = await User.find().select('-password');
  return res.status(200).json({
    message: 'Successfully fetched all users',
    data: users,
    success: true,
  });
};

export const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user)
    return res.status(404).json({
      message: 'User not found',
      success: false,
    });
  return res.status(200).json({
    message: 'User found',
    data: user,
    success: true,
  });
};

export const updateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!user)
    return res.status(404).json({
      message: 'User not found',
      success: false,
    });
  return res.status(200).json({
    message: 'User updated successfully',
    data: user,
    success: true,
  });
};

export const deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return res.status(404).json({
      message: 'User not found',
      success: false,
    });
  }
  return res.status(200).json({
    message: 'User deleted successfully',
    success: true,
  });
};
