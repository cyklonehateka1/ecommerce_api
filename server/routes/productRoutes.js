import express from "express";
import { jwtAuth } from "../middlewares/jwtAuth.js";
import {
  createProduct,
  deleteProduct,
  getOneProduct,
  getProducts,
  updateProduct,
} from "../controllers/productControllers.js";

const router = express.Router();

router.post("/add", jwtAuth, createProduct);
router.get("/:id", getOneProduct);
router.get("/", getProducts);
router.delete("/delete/:id", jwtAuth, deleteProduct);
router.put("/update/:id", jwtAuth, updateProduct);

export default router;
