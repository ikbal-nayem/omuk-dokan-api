import { VariantModel } from '@src/models/product-config.model';
import { ProductModel } from '@src/models/product.model';
import { Schema } from 'mongoose';

export const createProduct = async (req, res) => {
  try {
    const { name, description, hasVariants, price, discount, variants, sku, trackStock, stock, category, collections, tags, createdBy } = req.body;

    // Handle variants
    let variantIds: Schema.Types.ObjectId[] = [];
    if (hasVariants && variants) {
      const createdVariants = await VariantModel.insertMany(variants);
      variantIds = createdVariants.map((variant) => variant._id);
    }

    const newProduct = new ProductModel({
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
      createdBy,
      updatedBy: createdBy,
    });

    await newProduct.save();
    return res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

// Update a product by ID
export const updateProduct = async (req, res) => {
  try {
    const { name, description, hasVariants, price, discount, variants, sku, trackStock, stock, category, collections, tags, updatedBy } = req.body;

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
        updatedBy,
      },
      { new: true },
    ).populate(['variants', 'category', 'collections']);

    if (!updatedProduct || updatedProduct.isDeleted) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

// Get all products
export const getProducts = async (req: Request, res) => {
  try {
    const products = await ProductModel.find({ isDeleted: false }).populate(['variants', 'category', 'collections']);
    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

// Get a product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id).populate(['variants', 'category', 'collections']);
    if (!product || product.isDeleted) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

// Delete a product (soft delete)
export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await ProductModel.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};
