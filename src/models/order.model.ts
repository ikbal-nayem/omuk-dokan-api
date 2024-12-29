import { IDeliveryOption, IOrderDetails, IOrderItems, IPaymentOption } from '@src/interface/order.interface';
import { model, Schema } from 'mongoose';

export const deliveryOptionsSchema = new Schema<IDeliveryOption>({
  code: { type: String, required: true },
  title: { type: String, required: true },
  charge: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false}
});

export const paymentOptionsSchema = new Schema<IPaymentOption>({
  code: { type: String, required: true },
  title: { type: String, required: true },
  img: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false}
});

export const orderItemsSchema = new Schema<IOrderItems>({
  name: { type: String, required: true },
  summary: { type: String, required: true },
  price: { type: Number, required: true },
  discountPrice: { type: Number },
  costPrice: { type: Number },
  hasVariants: { type: Boolean, required: true },
  qty: { type: Number, required: true },
  selectedVariant: { type: Schema.Types.Mixed },
  sku: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  collections: [{ type: Schema.Types.ObjectId, ref: 'Collection' }],
  images: [{ type: String }],
  thumbnails: [{ type: String }],
});

export const orderSchema = new Schema<IOrderDetails>({
  items: [{ type: Schema.Types.ObjectId, ref: 'OrderItems', required: true }],
  subTotal: { type: Number, required: true },
  shippingCost: { type: Number, required: true },
  discount: { type: Number },
  total: { type: Number, required: true },
  deliveryAddress: { type: String, required: true },
  deliveryOption: { type: Schema.Types.ObjectId, ref: 'DeliveryOptions', required: true },
  paymentOption: { type: Schema.Types.ObjectId, ref: 'PaymentOptions', required: true },
  orderNo: { type: String, required: true },
  status: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  paymentStatus: { type: String, required: true },
  // paymentInfo: { type: Schema.Types.Mixed, required: true },
  deliveryStatus: { type: String, required: true },
  deliveryDate: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
});

orderSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export const OrderModel = model('Order', orderSchema);
export const OrderItemsModel = model('OrderItems', orderItemsSchema);
export const DeliveryOptionsModel = model('DeliveryOptions', deliveryOptionsSchema);
export const PaymentOptionsModel = model('PaymentOptions', paymentOptionsSchema);
