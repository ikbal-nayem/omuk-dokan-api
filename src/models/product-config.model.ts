import { ICategory, ICollection, IVariant } from '@src/interface/product.interface';
import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema<ICategory>({
  name: {
    type: String,
    required: true,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const collectionSchema = new mongoose.Schema<ICollection>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const variantSchema = new mongoose.Schema<IVariant>({
  variantOptions: [
    {
      name: { type: String, required: true },
      value: { type: String, required: true },
    },
  ],
  sku: { type: String, required: true },
  stock: { type: Number, default: 0 },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
});

const Category = mongoose.model('Category', categorySchema);
const Collection = mongoose.model('Collection', collectionSchema);
const Variant = mongoose.model('Variant', variantSchema);

export { Category, Collection, Variant };
