import upload from '@src/config/multer.config';
import { addProductImages, createProduct, deleteProduct, getProducts, updateProduct } from '@src/controllers/product.controller';
import { authenticate, authorize } from '@src/middlewares/user.middleware';
import { Router } from 'express';

const productRoutes = Router();

//  /api/product/*

productRoutes.get('/get', getProducts);
productRoutes.post('/add', authenticate, authorize('admin'), createProduct);
productRoutes.put('/:id', authenticate, authorize('admin'), updateProduct);
productRoutes.delete('/:id', authenticate, authorize('admin'), deleteProduct);

export default productRoutes;
