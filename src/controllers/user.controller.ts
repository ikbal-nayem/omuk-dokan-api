import { IUser } from '@src/interface/user.interface';
import UserModel from '@src/models/user.model';
import { throwNotFoundResponse, throwServerErrorResponse, throwUnauthorizedResponse } from '@src/utils/error-handler';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

// Generate JWT token
const generateToken = (id: string) => {
  return jwt.sign({ _id: id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export const createUser = async (req, res) => {
  const email = req.body.email;
  const mobile = req.body.mobile;
  const isEmailExists = await UserModel.findOne({ email, isDeleted: false });
  const isMobileExists = await UserModel.findOne({ mobile, isDeleted: false });
  if (isEmailExists || isMobileExists)
    return res.status(400).json({
      message: 'User already exists',
      success: false,
    });
  try {
    const newUser = await UserModel.create({ ...req.body });
    return res.status(201).json({
      message: 'User created successfully',
      data: { data: newUser, token: generateToken(newUser._id) },
      success: true,
    });
  } catch (error) {
    return throwServerErrorResponse(res, error);
  }
};

// Login user
export const login = async (req, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const userWithoutPassword = user.toObject();
    delete (userWithoutPassword as Partial<IUser>)?.password;

    const token = jwt.sign({ _id: user._id, roles: user.roles }, process.env.JWT_SECRET!, { expiresIn: '10d' });
    res.status(200).json({ success: true, token, data: userWithoutPassword });
  } catch (error) {
    return throwServerErrorResponse(res, error);
  }
};

export const getAllUsers = async (req, res) => {
  const users = await UserModel.find().select('-password');
  return res.status(200).json({
    message: 'Successfully fetched all users',
    data: users,
    success: true,
  });
};

export const getUserById = async (req, res) => {
  const user = await UserModel.findById(req.params.id).select('-password');
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

export const getUserInfoByHeaderToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return throwUnauthorizedResponse(res);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await UserModel.findById((decoded as any)._id).select('-password -__v -isDeleted -createdBy -updatedBy');
    if (!user) return throwUnauthorizedResponse(res);
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return throwServerErrorResponse(res, error);
  }
};

export const updateUser = async (req, res) => {
  const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
  const user = await UserModel.findByIdAndDelete(req.params.id);
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

// Assign roles (Only admin or superadmin)
export const assignUserRoles = async (req: Request, res: Response) => {
  try {
    const { roles } = req.body;
    const user = await UserModel.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.roles = roles;
    await user.save();

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    return throwServerErrorResponse(res, error);
  }
};

// User address CRUD
export const addUserAddress = async (req: Request, res: Response) => {
  try {
    const { address, isDefault } = req.body;
    const user = await UserModel.findById(req.user?._id);
    if (!user) return throwNotFoundResponse(res, 'User not found');

    if (isDefault) {
      user.address.forEach((addr) => (addr.isDefault = false));
    }

    user.address.push({ address, isDefault: user.address.length === 0 ? true : isDefault||false });
    await user.save();

    return res.status(201).json({ success: true, message: 'Address added successfully', data: user });
  } catch (error) {
    return throwServerErrorResponse(res, error);
  }
};

export const updateUserAddress = async (req: Request, res: Response) => {
  try {
    const addressId = req.params.addressId;
    const { address, isDefault } = req.body;
    const user = await UserModel.findById(req.user?._id);
    if (!user) return throwNotFoundResponse(res, 'User not found');

    const addressIndex = user.address.findIndex((addr) => addr._id!.toString() === addressId);
    if (addressIndex === -1) return throwNotFoundResponse(res, 'Address not found');

    if (isDefault) user.address.forEach((addr) => (addr.isDefault = false));

    user.address[addressIndex] = { _id: user.address[addressIndex]!._id, address, isDefault: isDefault || false };
    await user.save();

    return res.status(200).json({ success: true, message: 'Address updated successfully', data: user });
  } catch (error) {
    return throwServerErrorResponse(res, error);
  }
};

export const deleteUserAddress = async (req: Request, res: Response) => {
  try {
    const addressId = req.params.addressId;
    const user = await UserModel.findById(req.user?._id);
    if (!user) return throwNotFoundResponse(res, 'User not found');

    user.address = user.address.filter((addr) => addr._id!.toString() !== addressId);
    await user.save();

    return res.status(200).json({ success: true, message: 'Address deleted successfully', data: user });
  } catch (error) {
    return throwServerErrorResponse(res, error);
  }
};
