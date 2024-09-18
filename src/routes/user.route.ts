import { Router } from 'express';
import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from '@src/controllers/user.controller';

const userRoutes = Router();

//  /api/user/*

userRoutes.get('/get', getAllUsers);
userRoutes.get('/get/:id', getUserById);
userRoutes.post('/login');
userRoutes.post('/register', createUser);
userRoutes.put('/update/:id', updateUser);
userRoutes.delete('/delete/:id', deleteUser);

export default userRoutes;
