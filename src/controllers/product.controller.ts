import { VariantModel } from '@src/models/product-config.model';
import { ProductModel } from '@src/models/product.model';
import { isNull } from '@src/utils/check-validation';
import { throwBadRequestResponse, throwNotFoundResponse, throwServerErrorResponse } from '@src/utils/error-handler';
import { deleteFiles, moveFiles } from '@src/utils/file.util';
import { getRequestBody } from '@src/utils/generator';
import { Request, Response } from 'express';

const removeProductImages = (req: Request) => {
  const files = req.files as Express.Multer.File[];
  if (files) deleteFiles(files?.map((file) => file.path));
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    let {
      name,
      description,
      hasVariants,
      price,
      discount,
      variants,
      options,
      sku,
      trackStock,
      stock,
      category,
      collections,
      tags,
      isActive,
    } = getRequestBody(req);

    // Check if hasVariants is true but no variants are provided
    if (hasVariants && isNull(variants)) {
      removeProductImages(req);
      return throwBadRequestResponse(res, {
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
      price: hasVariants ? undefined : price,
      discount,
      hasVariants,
      options,
      variants: createdVariants || [],
      sku: hasVariants ? undefined : sku,
      trackStock,
      stock: hasVariants ? undefined : stock,
      category,
      collections,
      tags,
      isActive,
      createdBy: req.user,
      updatedBy: req.user,
    });

    await newProduct.save();

    const images = req.files as Express.Multer.File[];
    if (images.length > 0) {
      newProduct.images = moveFiles(
        'products/' + newProduct._id,
        images?.map((file) => file.path),
      ) as string[];
      await newProduct.save();
    }
    return res.status(201).json({ success: true, data: newProduct, message: 'Product created successfully.' });
  } catch (error) {
    removeProductImages(req);
    return throwServerErrorResponse(res, error);
  }
};

// Update a product by ID
export const updateProduct = async (req: Request, res: Response) => {
  let reqBody = getRequestBody(req);

  // Check if hasVariants is true but no variants are provided
  if (reqBody?.hasVariants && isNull(reqBody?.variants)) {
    return throwBadRequestResponse(res, {
      error: {
        message: 'Variants are required when hasVariants is true',
        errors: { variants: { message: 'Variants are required when hasVariants is true' } },
      },
    });
  }

  const currentProduct = await ProductModel.findById(req.params.id);
  
  if (currentProduct?.isDeleted) return throwNotFoundResponse(res, 'Product not found');

  const prevVariants = currentProduct?.variants || [];

  // Start a transaction
  const session = await ProductModel.startSession();
  session.startTransaction();
  try {
    // Update existing variants from new variants
    const variantIds = reqBody?.variants?.map((variant) => variant._id) || [];
    const existingVariantIds = prevVariants.map((variant) => variant._id);
    const deletedVariantIds = existingVariantIds.filter((id) => !variantIds.includes(id));
    if (!isNull(reqBody?.variants)) {
      const createdVariants = await VariantModel.insertMany(reqBody?.variants, { session });
      reqBody.variants = createdVariants.map((variant) => variant._id);
    }
    if (deletedVariantIds.length > 0) {
      await VariantModel.deleteMany({ _id: { $in: deletedVariantIds } }, { session });
    }

    // Handle new images or remove previous
    const deletedImages = currentProduct?.images?.filter((image) => !reqBody?.images?.includes(image));
    if (!isNull(deletedImages)) {
      deleteFiles(deletedImages || []);
    }
    const files = req.files as Express.Multer.File[];
    if (files.length > 0) {
      reqBody.images = [
        ...(reqBody?.images || []),
        ...moveFiles(
          'products/' + req.params.id,
          files?.map((file) => file.path),
        ),
      ];
    }

    reqBody.updatedBy = req.user;
    const updatedProduct = await ProductModel.findByIdAndUpdate(req.params.id, reqBody, {
      new: true,
      session,
    });
    await session.commitTransaction();
    return res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    session.abortTransaction();
    removeProductImages(req);
    throwBadRequestResponse(res, error);
  } finally {
    session.endSession();
  }
};

// Get all products
export const getProducts = async (req: Request, res) => {
  try {
    const products = await ProductModel.find({ isDeleted: false }).populate(['variants', 'category', 'collections']);
    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    return throwServerErrorResponse(res, error);
  }
};

// Get a product by ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await ProductModel.findById(req.params.id, { isDeleted: false }).populate([
      'variants',
      'category',
      'collections',
    ]);
    if (!product) {
      return throwNotFoundResponse(res, 'Product not found');
    }
    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    return throwServerErrorResponse(res, error);
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
      return throwNotFoundResponse(res, 'Product not found');
    }

    return res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    return throwServerErrorResponse(res, error);
  }
};
