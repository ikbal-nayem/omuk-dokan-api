import {
  addUserAddress,
  assignUserRoles,
  createUser,
  deleteUser,
  deleteUserAddress,
  getAllUsers,
  getUserById,
  getUserInfoByHeaderToken,
  login,
  updateUser,
  updateUserAddress,
} from '@src/controllers/user.controller';
import { authenticate, authorize } from '@src/middlewares/user.middleware';
import { Router } from 'express';

const userRoutes = Router();

//  /api/user/*

userRoutes.post('/register', createUser);
userRoutes.post('/login', login);
userRoutes.put('/assign-roles/:id', authenticate, authorize('admin', 'superadmin'), assignUserRoles);

userRoutes.get('/details', authenticate, getUserInfoByHeaderToken);
userRoutes.get('/get', getAllUsers);
userRoutes.get('/get/:id', getUserById);
userRoutes.post('/login');
userRoutes.put('/update/:id', updateUser);
userRoutes.delete('/delete/:id', authenticate, authorize('admin', 'superadmin'), deleteUser);

// User address routes
userRoutes.post('/address/add', authenticate, addUserAddress);
userRoutes.put('/address/:addressId', authenticate, updateUserAddress);
userRoutes.delete('/address/:addressId', authenticate, deleteUserAddress);

export default userRoutes;
