import mongoose from "mongoose";

const ProductSchema = mongoose.Schema(
  {
    name: {
      required: true,
      type: String,
      unique: true,
    },
    desc: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: true,
      unique: true,
    },
    categories: {
      type: [String],
    },
    color: {
      type: [String],
    },
    size: {
      type: [Array],
    },
    price: {
      type: String,
      required: true,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    quantityInStock: {
      type: Number,
    },
  },
  { timestamps: true }
);

export default mongoose.model("product", ProductSchema);
