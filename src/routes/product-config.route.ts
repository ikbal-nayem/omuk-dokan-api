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
import { Router } from 'express';

const productConfigRoutes = Router();

//  /api/product-config/*

productConfigRoutes.get('/categories', getCategoryTree);
productConfigRoutes.post('/category', createCategory);
productConfigRoutes.put('/category/:id', updateCategory);
productConfigRoutes.delete('/category/:id', deleteCategory);

productConfigRoutes.get('/collections', getCollections);
productConfigRoutes.post('/collection', createCollection);
productConfigRoutes.put('/collection/:id', updateCollection);
productConfigRoutes.delete('/collection/:id', deleteCollection);

export default productConfigRoutes;
