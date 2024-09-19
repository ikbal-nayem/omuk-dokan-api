import { CategoryModel, CollectionModel } from '@src/models/product-config.model';
import { Request, Response } from 'express';

// Category oparations
export const createCategory = async (req: Request, res: Response) => {
  try {
    const category = await CategoryModel.create(req.body);
    return res.status(201).json({
      message: 'Category created successfully',
      data: category,
      success: true,
    });
  } catch (error) {
    return res.status(400).json({
      error: error,
      success: false,
    });
  }
};

export const updateCategory = async (req, res) => {
  const category = await CategoryModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!category) {
    return res.status(404).json({
      message: 'Category not found',
      success: false,
    });
  }
  return res.status(200).json({
    message: 'Category updated successfully',
    data: category,
    success: true,
  });
};

export const getCategoryTree = async (req, res) => {
  try {
    const categories = await CategoryModel.find({ parent: null }).lean();
    // Recursive function to populate subcategories
    const populateSubcategories = async (category) => {
      const subcategories = await CategoryModel.find({ parent: category._id }).lean();
      category.subcategories = subcategories;
      if (subcategories.length > 0) {
        await Promise.all(subcategories.map(populateSubcategories));
      }
      return category;
    };
    const categoryTree = await Promise.all(categories.map(populateSubcategories));
    return res.status(200).json({ data: categoryTree, success: true });
  } catch (error) {
    return res.status(500).json({ message: error, success: false });
  }
};

export const deleteCategory = async (req, res) => {
  const category = await CategoryModel.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
  if (!category) {
    return res.status(404).json({
      message: 'Category not found',
      success: false,
    });
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
    const collection = await CollectionModel.create(req.body);
    return res.status(201).json({
      message: 'Collection created successfully',
      data: collection,
      success: true,
    });
  } catch (error) {
    return res.status(400).json({
      error: error,
      success: false,
    });
  }
};

export const updateCollection = async (req, res) => {
  const collection = await CollectionModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!collection) {
    return res.status(404).json({
      message: 'Collection not found',
      success: false,
    });
  }
  return res.status(200).json({
    message: 'Collection updated successfully',
    data: collection,
    success: true,
  });
};

export const getCollections = async (req, res) => {
  try {
    const collections = await CollectionModel.find({ isDeleted: false });
    return res.status(200).json({ data: collections, success: true });
  } catch (error) {
    return res.status(500).json({ message: error, success: false });
  }
};

export const deleteCollection = async (req, res) => {
  const collection = await CollectionModel.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
  if (!collection) {
    return res.status(404).json({
      message: 'Collection not found',
      success: false,
    });
  }
  return res.status(200).json({
    message: 'Collection deleted successfully',
    data: collection,
    success: true,
  });
};

// Collection End
