import { ICategory, ICollection, IVariant } from '@src/interface/product.interface';
import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema<ICategory>({
  name: { type: String, required: true },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  slug: { type: String, required: true },
  image: { type: String },
  description: { type: String },
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

categorySchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const collectionSchema = new mongoose.Schema<ICollection>({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  image: { type: String },
  slug: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

collectionSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const variantSchema = new mongoose.Schema<IVariant>({
  options: [
    {
      key: { type: String, required: true },
      value: { type: String, required: true },
    },
  ],
  sku: { type: String, required: true },
  stock: { type: Number, default: 0 },
  price: { type: Number, required: true },
  discountPrice: { type: Number, default: 0 },
  costPrice: { type: Number, default: 0 },
  image: { type: String },
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
});

const CategoryModel = mongoose.model('Category', categorySchema);
const CollectionModel = mongoose.model('Collection', collectionSchema);
const VariantModel = mongoose.model('Variant', variantSchema);

export { CategoryModel, CollectionModel, VariantModel };
