import { createProduct, deleteProduct, getProducts, updateProduct } from '@src/controllers/product.controller';
import { Router } from 'express';

const productRoutes = Router();

//  /api/product/*

productRoutes.get('/', getProducts);
productRoutes.post('/', createProduct);
productRoutes.put('/:id', updateProduct);
productRoutes.delete('/:id', deleteProduct);

export default productRoutes;
