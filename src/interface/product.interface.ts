import { Schema, Types } from 'mongoose';

export interface ICategory {
  name: string;
  parent?: Types.ObjectId | null; // Reference to the parent category or null if it's a root category
  slug: string;
  image?: string;
  description?: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: Schema.Types.ObjectId;
  updatedBy: Schema.Types.ObjectId;
}

export interface ICollection extends Document {
  name: string;
  description?: string;
  image?: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: Schema.Types.ObjectId;
  updatedBy: Schema.Types.ObjectId;
}

interface IVariantOption {
  name: string;
  value: string;
}

export interface IVariant {
  variantOptions: IVariantOption[];
  sku: string;
  stock: number;
  price: number;
  discount?: number;
  image?: string;
  isActive?: boolean;
  isDeleted?: boolean;
}

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  discount?: number;
  hasVariants: boolean;
  variants?: IVariant[];
  sku: string;
  trackStock: boolean;
  stock?: number;
  category: Schema.Types.ObjectId;
  collections?: Schema.Types.ObjectId[];
  tags?: string[];
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: Schema.Types.ObjectId;
  updatedBy: Schema.Types.ObjectId;
}
