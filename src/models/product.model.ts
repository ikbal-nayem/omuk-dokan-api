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
  discount: {
    type: Number,
    default: 0,
  },
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
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  collections: [{ type: Schema.Types.ObjectId, ref: 'Collection' }],
  tags: [{ type: String }],
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

const ProductModel = model('ProductModel', productSchema);
export { ProductModel };
