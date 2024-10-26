import upload from '@src/config/multer.config';
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  searchProducts,
  updateProduct,
} from '@src/controllers/product.controller';
import { mediaDir } from '@src/middlewares/common.middleware';
import { authenticate, authorize } from '@src/middlewares/user.middleware';
import { Router } from 'express';

const productRoutes = Router();

//  /api/product/*

productRoutes.get('/get', getProducts);
productRoutes.post('/search', searchProducts);
productRoutes.get('/get/:id', getProductById);
productRoutes.post('/add', authenticate, authorize('admin'), mediaDir('_temp'), upload.array('images'), createProduct);
productRoutes.put('/:id', authenticate, authorize('admin'), mediaDir('_temp'), upload.array('images'), updateProduct);
productRoutes.delete('/:id', authenticate, authorize('admin'), deleteProduct);

export default productRoutes;
