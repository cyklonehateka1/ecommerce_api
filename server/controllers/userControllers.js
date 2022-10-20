import UserSchema from "../models/UserModel.js";
import { errorHandler } from "../middlewares/errorHandler.js";

export const updateUser = async (req, res, next) => {
  try {
    if (!req.user.isVerified)
      return next(errorHandler(403, "Please verify your account first"));
    if (req.user.id === req.params.id || req.user.isAdmin) {
      const user = await UserSchema.findById(req.params.id);
      if (!user) return next(errorHandler(404, "User not found"));

      const modifiedUser = await UserSchema.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );

      res.status(200).json("User updated successfully");
    } else {
      return next(errorHandler(403, "You can update your account only"));
    }
  } catch (error) {
    return next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    if (
      req.user.id === req.params.id ||
      (req.user.isAdmin && req.user.isVerified)
    ) {
      const user = await UserSchema.findById(req.params.id);
      if (!user) return next(errorHandler(404, "User not found"));
      const removedUser = await UserSchema.findByIdAndDelete(req.params.id);
      res.status(200).json("Account deleted successfully");
    } else {
      return next(errorHandler(403, "You are not authorized"));
    }
  } catch (error) {
    return next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    if (req.user.isAdmin && req.user.isVerified) {
      const user = await UserSchema.findById(req.params.id);
      if (!user) return next(errorHandler(404, "User not found"));
      const { password, ...others } = user._doc;
      return res.status(200).json(others);
    }
    return next(errorHandler(403, "You are not authorized"));
  } catch (error) {
    return next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    if (req.user.isAdmin && req.user.isVerified) {
      const allUsers = await UserSchema.find();
      return res.status(200).json(allUsers);
    }
    return next(errorHandler(403, "You're not authorized"));
  } catch (error) {
    return next(error);
  }
};
