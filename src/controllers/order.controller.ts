import { IOrderPayload } from '@src/interface/order.interface';
import { DeliveryOptionsModel, OrderItemsModel, OrderModel, PaymentOptionsModel } from '@src/models/order.model';
import { throwNotFoundResponse, throwServerErrorResponse } from '@src/utils/error-handler';
import { Request, Response } from 'express';
import { startSession } from 'mongoose';

// Delivery options
export const createDeliveryOption = async (req: Request, res: Response) => {
  try {
    const deliveryOption = await DeliveryOptionsModel.create(req.body);
    return res.status(201).json({ success: true, data: deliveryOption });
  } catch (error) {
    return throwServerErrorResponse(res, error);
  }
};

export const updateDeliveryOption = async (req: Request, res: Response) => {
  try {
    const deliveryOption = await DeliveryOptionsModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!deliveryOption) return throwNotFoundResponse(res, 'Delivery option not found');
    return res.status(200).json({ success: true, data: deliveryOption });
  } catch (error) {
    return throwServerErrorResponse(res, error);
  }
};

export const getDeliveryOptions = async (req: Request, res: Response) => {
  try {
    const deliveryOptions = await DeliveryOptionsModel.find();
    return res.status(200).json({ success: true, data: deliveryOptions });
  } catch (error) {
    return throwServerErrorResponse(res, error);
  }
};

export const deleteDeliveryOption = async (req: Request, res: Response) => {
  try {
    const deliveryOption = await DeliveryOptionsModel.findByIdAndDelete(req.params.id);
    if (!deliveryOption) return throwNotFoundResponse(res, 'Delivery option not found');
    return res.status(200).json({ success: true, message: 'Delivery option deleted successfully' });
  } catch (error) {
    return throwServerErrorResponse(res, error);
  }
};

// Payment options
export const createPaymentOption = async (req: Request, res: Response) => {
  try {
    const paymentOption = await PaymentOptionsModel.create(req.body);
    return res.status(201).json({ success: true, data: paymentOption });
  } catch (error) {
    return throwServerErrorResponse(res, error);
  }
};

export const updatePaymentOption = async (req: Request, res: Response) => {
  try {
    const paymentOption = await PaymentOptionsModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!paymentOption) return throwNotFoundResponse(res, 'Payment option not found');
    return res.status(200).json({ success: true, data: paymentOption });
  } catch (error) {
    return throwServerErrorResponse(res, error);
  }
};

export const getPaymentOptions = async (req: Request, res: Response) => {
  try {
    const paymentOptions = await PaymentOptionsModel.find();
    return res.status(200).json({ success: true, data: paymentOptions });
  } catch (error) {
    return throwServerErrorResponse(res, error);
  }
};

export const deletePaymentOption = async (req: Request, res: Response) => {
  try {
    const paymentOption = await PaymentOptionsModel.findByIdAndDelete(req.params.id);
    if (!paymentOption) return throwNotFoundResponse(res, 'Payment option not found');
    return res.status(200).json({ success: true, message: 'Payment option deleted successfully' });
  } catch (error) {
    return throwServerErrorResponse(res, error);
  }
};

// Order
export const createOrder = async (req: Request, res: Response) => {
  const session = await startSession();
  session.startTransaction();
  try {
    const orderItems = await OrderItemsModel.insertMany(req.body.items, { session });

    // Prepare the order payload with the inserted items' IDs
    const orderPayload = {
      ...req.body,
      items: orderItems.map((item) => item._id),
    };

    // Create the order within the transaction
    const order = await OrderModel.create([orderPayload], { session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({ success: true, data: order });
  } catch (error) {
    // Abort the transaction in case of an error
    await session.abortTransaction();
    session.endSession();
    return throwServerErrorResponse(res, error);
  }
};
