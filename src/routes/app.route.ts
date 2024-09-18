import { Router } from 'express';
import userRoutes from './user.route';
import productRoutes from './product.route';
import productConfigRoutes from './product-config.route';

const appRoutes = Router();

//  /api/user
appRoutes.use('/user', userRoutes);

//  /api/product-config
appRoutes.use('/product-config', productConfigRoutes);

//  /api/product
appRoutes.use('/product', productRoutes);

export default appRoutes;
