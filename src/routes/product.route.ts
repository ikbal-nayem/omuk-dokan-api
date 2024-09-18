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

const productRoutes = Router();

//  /api/product/*

productRoutes.get('/categories', getCategoryTree);
productRoutes.post('/category', createCategory);
productRoutes.put('/category/:id', updateCategory);
productRoutes.delete('/category/:id', deleteCategory);

productRoutes.get('/collections', getCollections);
productRoutes.post('/collection', createCollection);
productRoutes.put('/collection/:id', updateCollection);
productRoutes.delete('/collection/:id', deleteCollection);

export default productRoutes;
