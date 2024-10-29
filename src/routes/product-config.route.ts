import upload from '@src/config/multer.config';
import {
  createCategory,
  createCollection,
  deleteCategory,
  deleteCollection,
  getCategoryTree,
  getCollections,
  isCategorySlugUnique,
  isCollectionSlugUnique,
  searchCollections,
  updateCategory,
  updateCollection,
} from '@src/controllers/product-config.controller';
import { mediaDir } from '@src/middlewares/common.middleware';
import { authenticate, authorize } from '@src/middlewares/user.middleware';
import { Router } from 'express';

const productConfigRoutes = Router();

//  /api/product-config/*

productConfigRoutes.get('/category-tree', getCategoryTree);
productConfigRoutes.post('/category', authenticate, authorize('admin'), mediaDir('category'), upload.single('image'), createCategory);
productConfigRoutes.put('/category/:id', authenticate, authorize('admin'), mediaDir('category'), upload.single('image'), updateCategory);
productConfigRoutes.get('/category/is-slug-unique', authenticate, authorize('admin'), isCategorySlugUnique);
productConfigRoutes.delete('/category/:id', authenticate, authorize('admin'), deleteCategory);

productConfigRoutes.get('/collections', getCollections);
productConfigRoutes.post('/collection/search', searchCollections);
productConfigRoutes.post('/collection', authenticate, authorize('admin'), mediaDir('collection'), upload.single('image'), createCollection);
productConfigRoutes.put('/collection/:id', authenticate, authorize('admin'), mediaDir('collection'), upload.single('image'), updateCollection);
productConfigRoutes.get('/collection/is-slug-unique', authenticate, authorize('admin'), isCollectionSlugUnique);
productConfigRoutes.delete('/collection/:id', authenticate, authorize('admin'), deleteCollection);

export default productConfigRoutes;
