import upload from '@src/config/multer.config';
import { VariantModel } from '@src/models/product-config.model';
import { ProductModel } from '@src/models/product.model';
import { throwErrorResponse, throwNotFoundResponse } from '@src/utils/error-handler';
import { NextFunction, Request, Response } from 'express';
import { Schema } from 'mongoose';

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, hasVariants, price, discount, variants, sku, trackStock, stock, category, collections, tags } =
      req.body;

    // Check if hasVariants is true but no variants are provided
    if (hasVariants && (!variants || variants.length === 0)) {
      return throwErrorResponse(res, {
        error: {
          message: 'Variants are required when hasVariants is true',
          errors: { variants: { message: 'Variants are required when hasVariants is true' } },
        },
      });
    }

    // Handle variants
    let createdVariants;
    if (hasVariants && variants) {
      createdVariants = await VariantModel.insertMany(variants);
    }

    const newProduct = new ProductModel({
      name,
      description,
      hasVariants,
      price: hasVariants ? undefined : price,
      discount,
      variants: createdVariants || [],
      sku: hasVariants ? undefined : sku,
      trackStock,
      stock: hasVariants ? undefined : stock,
      category,
      collections,
      tags,
      createdBy: req.user,
      updatedBy: req.user,
    });

    await newProduct.save();
    req.mediaDir = 'products/' + newProduct._id;
    req.params.id = newProduct._id.toString();
    addProductImages(req, res);
  } catch (error) {
    return throwErrorResponse(res, error);
  }
};

export const addProductImages = async (req: Request, res: Response) => {
  try {
    console.log(req.mediaDir);
    
    upload.array('images')(req, res, async (err) => {
      if (err) {
        return throwErrorResponse(res, err);
      }
      console.log(req.files);
      
      const product = await ProductModel.findById(req.params.id);
      if (!product) return throwNotFoundResponse(res, 'Product not found to upload images.');

      const imageFiles = req?.files as Express.Multer.File[];
      if (imageFiles && imageFiles?.length > 0) {
        product.images = imageFiles?.map((f) => f.path);
      }
      await product.save();
      return res.status(200).json({ success: true, data: product, message: 'Product added successfully.' });
    });
  } catch (error) {
    throwErrorResponse(res, error);
  }
};

// Update a product by ID
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, hasVariants, price, discount, variants, sku, trackStock, stock, category, collections, tags } =
      req.body;

    // Check if hasVariants is true but no variants are provided
    if (hasVariants && (!variants || variants.length === 0)) {
      return throwErrorResponse(res, {
        error: {
          message: 'Variants are required when hasVariants is true',
          errors: { variants: { message: 'Variants are required when hasVariants is true' } },
        },
      });
    }

    // Handle variant updates (you can either add new variants or update existing ones)
    let variantIds: Schema.Types.ObjectId[] = [];
    if (hasVariants && variants) {
      const createdVariants = await VariantModel.insertMany(variants);
      variantIds = createdVariants.map((variant) => variant._id);
    }

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        hasVariants,
        price: hasVariants ? undefined : price,
        discount,
        variants: variantIds,
        sku: hasVariants ? undefined : sku,
        trackStock,
        stock: hasVariants ? undefined : stock,
        category,
        collections,
        tags,
        updatedBy: req.user,
      },
      { new: true },
    ).populate(['variants', 'category', 'collections']);

    if (!updatedProduct || updatedProduct.isDeleted) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    return throwErrorResponse(res, error);
  }
};

// Get all products
export const getProducts = async (req: Request, res) => {
  try {
    const products = await ProductModel.find({ isDeleted: false }).populate(['variants', 'category', 'collections']);
    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    return throwErrorResponse(res, error);
  }
};

// Get a product by ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await ProductModel.findById(req.params.id).populate(['variants', 'category', 'collections']);
    if (!product || product.isDeleted) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    return throwErrorResponse(res, error);
  }
};

// Delete a product (soft delete)
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const deletedProduct = await ProductModel.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true, updatedBy: req.user?._id },
      { new: true },
    );

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    return throwErrorResponse(res, error);
  }
};
