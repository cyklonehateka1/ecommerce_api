import express from "express";
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getUserOrders,
  updateOrder,
} from "../controllers/orderControllers.js";
import { jwtAuth } from "../middlewares/jwtAuth.js";

const router = express.Router();

router.post("/new", jwtAuth, createOrder);
router.get("/", jwtAuth, getAllOrders);
router.get("/:userId", jwtAuth, getUserOrders);
router.put("/update/:id", jwtAuth, updateOrder);
router.delete("/delete/:id", jwtAuth, deleteOrder);

export default router;
