import { Schema } from 'mongoose';
import { IVariant } from './product.interface';
import { IUser } from './user.interface';

export type IPaymentOption = {
  code: string;
  title: string;
  img: string;
  isActive: boolean;
  isDeleted: boolean;
};

export type IDeliveryOption = {
  code: string;
  title: string;
  charge: number;
  isActive: boolean;
  isDeleted: boolean;
};

export type IOrderPayload = {
  items: IOrderItems[];
  subTotal: number;
  shippingCost: number;
  discount?: number;
  total: number;
  deliveryAddress: string;
  deliveryOption: IDeliveryOption;
  paymentOption: IPaymentOption;
};

export interface IOrderDetails extends IOrderPayload {
  _id: Schema.Types.ObjectId;
  orderNo: string;
  status: string;
  user: IUser;
  paymentStatus: string;
  // paymentInfo: any;
  deliveryStatus: string;
  deliveryDate: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: Schema.Types.ObjectId;
  updatedBy: Schema.Types.ObjectId;
}

export interface IOrderItems {
  name: string;
  summary: string;
  price: number;
  discountPrice?: number;
  costPrice?: number;
  hasVariants: boolean;
  qty: number;
  selectedVariant?: IVariant;
  sku: string;
  category: Schema.Types.ObjectId;
  collections?: Schema.Types.ObjectId[];
  images?: Array<string>;
  thumbnails?: Array<string>;
}
