import express from "express";
import {
  createCart,
  deleteCart,
  getAllCarts,
  getUserCart,
  updateCart,
} from "../controllers/cartControllers.js";
import { jwtAuth } from "../middlewares/jwtAuth.js";

const router = express.Router();

router.post("/new", jwtAuth, createCart);
router.get("/", jwtAuth, getAllCarts);
router.get("/:userId", jwtAuth, getUserCart);
router.put("/update/:userId", jwtAuth, updateCart);
router.delete("/delete/:userId", jwtAuth, deleteCart);

export default router;
