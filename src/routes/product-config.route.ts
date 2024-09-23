import upload from '@src/config/multer.config';
import {
  createCategory,
  createCollection,
  deleteCategory,
  deleteCollection,
  getCategoryTree,
  getCollections,
  updateCategory,
  updateCollection,
} from '@src/controllers/product-config.controller';
import { mediaDir } from '@src/middlewares/common.middleware';
import { authenticate, authorize } from '@src/middlewares/user.middleware';
import { Router } from 'express';

const productConfigRoutes = Router();

//  /api/product-config/*

productConfigRoutes.get('/categories', getCategoryTree);
productConfigRoutes.post('/category', authenticate, authorize('admin'), mediaDir('category'), upload.single('image'), createCategory);
productConfigRoutes.put('/category/:id', authenticate, authorize('admin'), mediaDir('category'), upload.single('image'), updateCategory);
productConfigRoutes.delete('/category/:id', authenticate, authorize('admin'), deleteCategory);

productConfigRoutes.get('/collections', getCollections);
productConfigRoutes.post('/collection', authenticate, authorize('admin'), createCollection);
productConfigRoutes.put('/collection/:id', authenticate, authorize('admin'), updateCollection);
productConfigRoutes.delete('/collection/:id', authenticate, authorize('admin'), deleteCollection);

export default productConfigRoutes;
