import { Router } from 'express';
import userRoutes from './user.route';
import productRoutes from './product.route';

const appRoutes = Router();

//  /api/user
appRoutes.use('/user', userRoutes);

//  /api/product
appRoutes.use('/product', productRoutes);

export default appRoutes;
