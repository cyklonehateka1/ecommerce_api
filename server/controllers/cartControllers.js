import CartSchema from "../models/CartModel.js";
import { errorHandler } from "../middlewares/errorHandler.js";

export const createCart = async (req, res, next) => {
  try {
    if (!req.user.isVerified)
      return next(errorHandler(403, "Please verify your account"));
    const cart = new CartSchema({
      userId: req.user.id,
      products: req.body.products,
    });
    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    return next(error);
  }
};

export const getUserCart = async (req, res, next) => {
  try {
    if (!req.user.isVerified)
      return next(errorHandler(404, "Please verify your account"));
    if (req.user.id === req.params.userId) {
      const cart = await CartSchema.findOne({ userId: req.params.userId });
      if (!cart) return next(errorHandler(404, "Cart not found"));
      return res.status(200).json(cart);
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
    return next(errorHandler(403, "You are not authorized"));
  } catch (error) {
    return next(error);
  }
};

export const updateCart = async (req, res, next) => {
  try {
    if (!req.user.isVerified)
      return next(errorHandler(403, "Please verify your account first"));
    if (req.user.id === req.params.userId) {
      const cart = await CartSchema.findOne({
        userId: req.user.id,
        _id: req.params.id,
      });
      if (!cart) return next(errorHandler(404, "cart not found"));

      const modifiedCart = await CartSchema.findOneAndUpdate(
        { userId: req.user.id, _id: req.params.id },
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
      const cart = await CartSchema.findById(req.params.id);
      if (!cart) return next(errorHandler(404, "Cart not found"));
      const removedCart = await CartSchema.findByIdAndDelete(req.params.id);
      return res.status(200).json("Cart deleted successfully");
    } else {
      return next(errorHandler(403, "You are not authorized"));
    }
  } catch (error) {
    return next(error);
  }
};
