import upload from '@src/config/multer.config';
import { createDeliveryOption, getDeliveryOptions, updateDeliveryOption } from '@src/controllers/order.controller';
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

const orderRoutes = Router();

//  /api/order/*

orderRoutes.get('/conf/delivery/get', getDeliveryOptions);
orderRoutes.post('/conf/delivery/add', authenticate, authorize('admin'), createDeliveryOption);
orderRoutes.put('/conf/delivery/:id', updateDeliveryOption);

orderRoutes.get('/get', getProducts);
orderRoutes.post('/search', searchProducts);
orderRoutes.get('/get/:id', getProductById);
orderRoutes.post('/add', authenticate, authorize('admin'), mediaDir('_temp'), upload.array('images'), createProduct);
orderRoutes.put('/:id', authenticate, authorize('admin'), mediaDir('_temp'), upload.array('images'), updateProduct);
orderRoutes.delete('/:id', authenticate, authorize('admin'), deleteProduct);

export default orderRoutes;
