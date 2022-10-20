import CartSchema from "../models/CartModel.js";
import { errorHandler } from "../middlewares/errorHandler.js";

export const createCart = async (req, res, next) => {
  try {
    if (!req.user.isVerified)
      return next(errorHandler(403, "Please verify your account"));
    const cart = new CartSchema({
      user: req.params.userId,
      products: req.body,
    });
    await cart.save();
  } catch (error) {}
};

export const getUserCart = async (req, res, next) => {
  try {
    if (!req.user.isVerified)
      return next(errorHandler(404, "Please verify your account"));
    if (req.user.id === req.params.userId) {
      const cart = await CartSchema.findOne({ userId: req.params.userId });
      if (!cart) return next(errorHandler(404, "Cart not found"));
      return res.status(200).json(product);
    }
    return next(errorHandler(403, "You are not authorized"));
  } catch (error) {
    return next(error);
  }
};

export const getAllCarts = async (req, res, next) => {
  try {
    if (!req.user.isVerified)
      return next(errorHandler(403, "You're not verified"));
    if (req.user.isAdmin) {
      const carts = await CartSchema.find();
      if (carts.length === 0) return next(errorHandler(404, "No cart found"));
      return res.status(200).json(carts);
    }
  } catch (error) {}
};

export const updateCart = async (req, res, next) => {
  try {
    if (!req.user.isVerified)
      return next(errorHandler(403, "Please verify your account first"));
    if (req.user.id === req.params.userId) {
      const cart = await CartSchema.findOne({ userId: req.params.userId });
      if (!cart) return next(errorHandler(404, "cart not found"));

      const modifiedCart = await CartSchema.findOneAndUpdate(
        { userId: req.params.userId },
        {
          $set: req.body,
        },
        { new: true }
      );

      return res.status(200).json(modifiedCart);
    } else {
      return next(errorHandler(403, "You're not authorized"));
    }
  } catch (error) {
    return next(error);
  }
};

export const deleteCart = async (req, res, next) => {
  try {
    if (!req.user.isVerified)
      return next(errorHandler(403, "You're not verified"));
    if (req.user.isAdmin) {
      const cart = await CartSchema.findOne(req.params.userId);
      if (!cart) return next(errorHandler(404, "Cart not found"));
      const removedCart = await CartSchema.findOneAndDelete({
        userId: req.params.userId,
      });
      return res.status(200).json("Cart deleted successfully");
    } else {
      return next(errorHandler(403, "You are not authorized"));
    }
  } catch (error) {
    return next(error);
  }
};
