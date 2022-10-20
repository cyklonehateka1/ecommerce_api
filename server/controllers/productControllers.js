import ProductSchema from "../models/ProductModel.js";
import { errorHandler } from "../middlewares/errorHandler.js";

export const createProduct = async (req, res, next) => {
  try {
    const { name, price, desc, img } = req.body;

    if (req.user.isAdmin && req.user.isVerified) {
      if (!name || !price || !img || !desc)
        return next(errorHandler(400, "Some fields are reqired"));
      const checkProductName = await ProductSchema.findOne({
        name: req.body.name,
      });

      if (checkProductName)
        return next(errorHandler(409, "Product name must be unique"));

      const checkProductImage = await ProductSchema.findOne({
        img: req.body.img,
      });

      if (checkProductImage)
        return next(errorHandler(409, "Product image must be unique"));

      const newProduct = new ProductSchema(req.body);
      await newProduct.save();
      return res.status(201).json("Product added successfully");
    }
    return next(errorHandler(403, "You are not authorized"));
  } catch (error) {
    return next(error);
  }
};

export const getOneProduct = async (req, res, next) => {
  try {
    const product = await ProductSchema.findById(req.params.id);
    if (!product) return next(errorHandler(404, "Product not found"));
    res.status(200).json(product);
  } catch (error) {
    return next(error);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const products = await ProductSchema.find();
    if (products.length === 0)
      return next(errorHandler(404, "No product found"));
    res.status(200).json(products);
  } catch (error) {}
};

export const updateProduct = async (req, res, next) => {
  try {
    if (!req.user.isVerified)
      return next(errorHandler(403, "Please verify your account first"));
    if (req.user.isAdmin) {
      const product = await ProductSchema.findById(req.params.id);
      if (!product) return next(errorHandler(404, "Product not found"));

      const modifiedProduct = await ProductSchema.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );

      res.status(200).json("Product updated successfully");
    } else {
      return next(errorHandler(403, "You're not authorized"));
    }
  } catch (error) {
    return next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    if (!req.user.isVerified)
      return next(errorHandler(403, "You're not verified"));
    if (req.user.isAdmin) {
      const product = await ProductSchema.findById(req.params.id);
      if (!product) return next(errorHandler(404, "Product not found"));
      const removedProduct = await ProductSchema.findByIdAndDelete(
        req.params.id
      );
      res.status(200).json("Product deleted successfully");
    } else {
      return next(errorHandler(403, "You are not authorized"));
    }
  } catch (error) {
    return next(error);
  }
};
