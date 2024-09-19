import { createProduct, deleteProduct, getProducts, updateProduct } from '@src/controllers/product.controller';
import { authenticate, authorize } from '@src/middlewares/user.middleware';
import { Router } from 'express';

const productRoutes = Router();

//  /api/product/*

productRoutes.get('/', getProducts);
productRoutes.post('/', authenticate, authorize('admin'), createProduct);
productRoutes.put('/:id', authenticate, authorize('admin'), updateProduct);
productRoutes.delete('/:id', authenticate, authorize('admin'), deleteProduct);

export default productRoutes;
