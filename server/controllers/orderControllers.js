import OrderSchema from "../models/OrderModel.js";
import { errorHandler } from "../middlewares/errorHandler.js";

export const createOrder = async (req, res, next) => {
  try {
    const { amount, address, status, userId, products } = req.body;
    if (!req.user.isVerified)
      return next(errorHandler(403, "Please verify your account"));
    const order = new OrderSchema({
      userId: req.user.id,
      amount,
      address,
      status,
      products,
    });
    await order.save();
    res.status(200).json("Successfully placed order");
  } catch (error) {
    return next(error);
  }
};

export const getUserOrders = async (req, res, next) => {
  try {
    if (!req.user.isVerified)
      return next(errorHandler(404, "Please verify your account"));
    if (req.user.id === req.params.userId || req.user.isAdmin) {
      const orders = await OrderSchema.find({ userId: req.params.userId });
      if (!orders || orders.length === 0)
        return next(errorHandler(404, "Order not found"));
      return res.status(200).json(orders);
    }
    return next(errorHandler(403, "You are not authorized"));
  } catch (error) {
    return next(error);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    if (!req.user.isVerified)
      return next(errorHandler(403, "You're not verified"));
    if (req.user.isAdmin) {
      const orders = await OrderSchema.find();
      if (orders.length === 0) return next(errorHandler(404, "No order found"));
      return res.status(200).json(orders);
    }
    return next(errorHandler(403, "You're not authorized"));
  } catch (error) {
    return next(error);
  }
};

export const updateOrder = async (req, res, next) => {
  try {
    if (!req.user.isVerified)
      return next(errorHandler(403, "Please verify your account first"));
    if (req.user.isAdmin) {
      const order = await OrderSchema.findById(req.params.id);
      if (!order) return next(errorHandler(404, "Order not found"));

      const modifiedOrder = await OrderSchema.findByIdAndUpdate(
        req.params.id,
        {
          $set: { status: req.body.status },
        },
        { new: true }
      );

      return res.status(200).json(modifiedOrder);
    } else {
      return next(errorHandler(403, "You're not authorized"));
    }
  } catch (error) {
    return next(error);
  }
};

export const deleteOrder = async (req, res, next) => {
  try {
    if (!req.user.isVerified)
      return next(errorHandler(403, "You're not verified"));
    if (req.user.isAdmin) {
      const order = await OrderSchema.findById(req.params.id);
      if (!order) return next(errorHandler(404, "Order not found"));
      const removedOrder = await OrderSchema.findByIdAndDelete(req.params.id);
      return res.status(200).json("Order deleted successfully");
    } else {
      return next(errorHandler(403, "You are not authorized"));
    }
  } catch (error) {
    return next(error);
  }
};
