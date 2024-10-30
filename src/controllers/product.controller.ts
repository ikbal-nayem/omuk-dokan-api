import { IObject } from '@src/interface/common.interface';
import { CategoryModel, CollectionModel, VariantModel } from '@src/models/product-config.model';
import { ProductModel } from '@src/models/product.model';
import { isNull } from '@src/utils/check-validation';
import { throwBadRequestResponse, throwNotFoundResponse, throwServerErrorResponse } from '@src/utils/error-handler';
import { deleteFiles, moveFiles } from '@src/utils/file.util';
import { generateSearchQuery, getRequestBody } from '@src/utils/request.utils';
import { getPaginatedData, responseWithMeta } from '@src/utils/response.utils';
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
    if (deletedVariantIds.length > 0) {
      await VariantModel.deleteMany({ _id: { $in: deletedVariantIds } }, { session });
    }
    if (!isNull(reqBody?.variants)) {
      const createdVariants = await VariantModel.insertMany(reqBody?.variants, { session });
      reqBody.variants = createdVariants.map((variant) => variant._id);
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

// Get products
export const getProducts = async (req: Request, res) => {
  try {
    const isActive = req.query.isActive;
    const query: any = { isDeleted: false };
    if (!isNull(isActive)) {
      query.isActive = isActive === 'true';
    }
    let queryBuilder = ProductModel.find(query)
      .select(['-__v', '-isDeleted', '-createdBy', '-updatedBy'])
      .populate(['variants', 'category', 'collections']);

    const meta = req.body?.meta;
    const limit = parseInt(meta?.limit as string);
    if (limit && limit > 0)
      queryBuilder = queryBuilder.limit(limit).skip((parseInt((req.query?.page as string) || '1') - 1) * limit);

    const products = await queryBuilder.exec();
    const productsCount = await ProductModel.countDocuments(query);
    return responseWithMeta(res, products, productsCount, { page: req.query?.page, limit: meta?.limit });
  } catch (error) {
    return throwServerErrorResponse(res, error);
  }
};

export const searchProducts = async (req: Request, res: Response) => {
  try {
    const meta = req.body?.meta;
    const qParams = req.body?.filter;
    const query: IObject = generateSearchQuery(req);    
    if (qParams?.searchKey) {
      query.$or = [
        { name: { $regex: qParams?.searchKey, $options: 'i' } },
        { description: { $regex: qParams?.searchKey, $options: 'i' } },
        { sku: { $regex: qParams?.searchKey, $options: 'i' } },
        { tags: { $regex: qParams?.searchKey, $options: 'i' } },
      ];
    }
    if (qParams?.categorySlug) {
      const category = await CategoryModel.findOne({ slug: qParams.categorySlug, isDeleted: false });
      if (category) {
        query.category = category._id;
        delete query.categorySlug;
      }
    }
    if (qParams?.collectionSlug) {
      const collection = await CollectionModel.findOne({ slug: qParams.collectionSlug, isDeleted: false });
      if (collection) {
        query.collections = collection._id;
        delete query.collectionSlug;
      }
    }

    console.log(query);

    let queryBuilder = ProductModel.find(query)
      .select(['-__v', '-isDeleted', '-createdBy', '-updatedBy'])
      .populate([
        'variants',
        { path: 'category', select: '_id name slug description' },
        { path: 'collections', select: '_id name slug description' },
      ]);

    const products = await getPaginatedData(req, queryBuilder).exec();
    const productsCount = await ProductModel.countDocuments(query);

    return responseWithMeta(res, products, productsCount, meta);
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
