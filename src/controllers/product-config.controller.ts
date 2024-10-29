import { CategoryModel, CollectionModel } from '@src/models/product-config.model';
import { isNull } from '@src/utils/check-validation';
import { throwBadRequestResponse, throwNotFoundResponse, throwServerErrorResponse } from '@src/utils/error-handler';
import { deleteFiles } from '@src/utils/file.util';
import { getPaginatedData, responseWithMeta } from '@src/utils/response.utils';
import { Request, Response } from 'express';

// Category oparations
export const createCategory = async (req: Request, res: Response) => {
  try {
    const existingCategory = await CategoryModel.findOne({ slug: req.body.slug, isDeleted: false });
    if (existingCategory) {
      req.file?.path && deleteFiles(req.file?.path);
      return throwBadRequestResponse(res, {
        message: 'Category already exists',
        fields: [{ field: 'slug', message: 'Category with this slug already exists' }],
      });
    }

    req.body.image = req.file?.path;
    req.body.parent = isNull(req.body?.parent) ? null : req.body?.parent;
    const category = await CategoryModel.create({ ...req.body });
    return res.status(201).json({
      message: 'Category created successfully',
      data: category,
      success: true,
    });
  } catch (error) {
    return throwServerErrorResponse(res, error);
  }
};

export const updateCategory = async (req, res) => {
  const category = await CategoryModel.findById(req.params?.id);
  if (!category) {
    return throwNotFoundResponse(res, 'Category not found');
  }

  const existingCategory = await CategoryModel.findOne({ slug: req.body.slug, id: { $ne: req.params.id }, isDeleted: false });
  if (existingCategory) {
    return throwBadRequestResponse(res, {
      message: 'Category already exists',
      fields: [{ field: 'slug', message: 'Category with this slug already exists' }],
    });
  }

  if ((req.file || !req.body.image) && category.image) {
    deleteFiles(category.image);
  }

  req.body.image = req.file?.path || req.body.image;
  req.body.parent = isNull(req.body?.parent) ? null : req.body?.parent;

  const updatedCategory = await CategoryModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  return res.status(200).json({
    message: 'Category updated successfully',
    data: updatedCategory,
    success: true,
  });
};

export const getCategoryTree = async (req, res) => {
  try {
    const categories = await CategoryModel.find({ parent: null, isDeleted: false }).lean();
    // Recursive function to populate subcategories
    const populateSubcategories = async (category) => {
      const subcategories = await CategoryModel.find({ parent: category._id, isDeleted: false }).lean();
      category.subcategories = subcategories;
      if (subcategories.length > 0) {
        await Promise.all(subcategories.map(populateSubcategories));
      }
      return category;
    };
    const categoryTree = await Promise.all(categories.map(populateSubcategories));
    return res.status(200).json({ data: categoryTree, success: true });
  } catch (error) {
    return throwServerErrorResponse(res, error);
  }
};

export const isCategorySlugUnique = async (req, res) => {
  const category = await CategoryModel.findOne({ slug: req.query.slug, isDeleted: false });
  return res.status(200).json({ data: !category, success: true });
};

export const deleteCategory = async (req, res) => {
  const category = await CategoryModel.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
  if (!category) {
    return throwNotFoundResponse(res, 'Category not found');
  }
  return res.status(200).json({
    message: 'Category deleted successfully',
    data: category,
    success: true,
  });
};

// Category End

// Collection oparations
export const createCollection = async (req, res) => {
  try {
    const existingCollection = await CollectionModel.findOne({ slug: req.body.slug, isDeleted: false });
    if (existingCollection) {
      req.file?.path && deleteFiles(req.file?.path);
      return throwBadRequestResponse(res, {
        message: 'Collection already exists',
        fields: [{ field: 'slug', message: 'Collection with this slug already exists' }],
      });
    }
    req.body.image = req.file?.path;
    const collection = await CollectionModel.create(req.body);
    return res.status(201).json({
      message: 'Collection created successfully',
      data: collection,
      success: true,
    });
  } catch (error) {
    return throwServerErrorResponse(res, error);
  }
};

export const updateCollection = async (req, res) => {
  const collection = await CollectionModel.findById(req.params?.id);
  if (!collection) {
    return throwNotFoundResponse(res, 'Collection not found');
  }

  if ((req.file || !req.body.image) && collection.image) {
    deleteFiles(collection.image);
  }

  req.body.image = req.file?.path || req.body.image;

  const newCollection = await CollectionModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  return res.status(200).json({
    message: 'Collection updated successfully',
    data: newCollection,
    success: true,
  });
};

export const getCollections = async (req, res) => {
  try {
    const collections = await CollectionModel.find({ isDeleted: false });
    return res.status(200).json({ data: collections, success: true });
  } catch (error) {
    return throwServerErrorResponse(res, error);
  }
};

export const searchCollections = async (req, res) => {
  try {
    const meta = req.body?.meta;
    const q = req.body?.filter;
    const query: any = { isDeleted: false };
    if (q?.searchKey) {
      query.$or = [{ name: { $regex: q?.searchKey, $options: 'i' } }, { description: { $regex: q?.searchKey, $options: 'i' } }];
    }
    if (!isNull(q?.isActive)) {
      query.isActive = q.isActive;
    }

    const queryBuilder = CollectionModel.find(query).select('-__v -isDeleted -createdBy -updatedBy');
    const collections = await getPaginatedData(req, queryBuilder).exec();
    const collectionsCount = await CollectionModel.countDocuments(query);

    return responseWithMeta(res, collections, collectionsCount, meta);
  } catch (error) {
    return throwServerErrorResponse(res, error);
  }
};

export const isCollectionSlugUnique = async (req, res) => {
  const collection = await CollectionModel.findOne({ slug: req.query.slug, isDeleted: false });
  return res.status(200).json({ data: !collection, success: true });
};

export const deleteCollection = async (req, res) => {
  const collection = await CollectionModel.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
  if (!collection) {
    return throwNotFoundResponse(res, 'Collection not found');
  }
  return res.status(200).json({
    message: 'Collection deleted successfully',
    data: collection,
    success: true,
  });
};

// Collection End
