import { IProduct } from '@src/interface/product.interface';
import { Schema, model } from 'mongoose';

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  description: { type: String },
  hasVariants: { type: Boolean, default: false },
  price: {
    type: Number,
    required: function () {
      return !this.hasVariants;
    },
  },
  discountPrice: { type: Number, default: 0 },
  costPrice: { type: Number, default: 0 },
  height: { type: Number, default: 0 },
  heightUnit: { type: String, default: 'cm' },
  width: { type: Number, default: 0 },
  widthUnit: { type: String, default: 'cm' },
  weight: { type: Number, default: 0 },
  weightUnit: { type: String, default: 'gm' },
  options: [{ id: Number, name: String, value: [{ id: Number, name: String }] }],
  variants: [{ type: Schema.Types.ObjectId, ref: 'Variant' }],
  sku: {
    type: String,
    required: function () {
      return !this.hasVariants;
    },
    unique: true,
  },
  trackStock: { type: Boolean, default: true },
  stock: { type: Number, default: 0 },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  collections: [{ type: Schema.Types.ObjectId, ref: 'Collection' }],
  tags: [{ type: String }],
  images: [{ type: String }],
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
});

productSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const ProductModel = model('Product', productSchema);
export { ProductModel };
