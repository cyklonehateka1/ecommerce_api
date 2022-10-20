import express from "express";
import {
  updateUser,
  deleteUser,
  getUser,
  getAllUsers,
} from "../controllers/userControllers.js";
import { jwtAuth } from "../middlewares/jwtAuth.js";

const router = express.Router();

router.put("/update/:id", jwtAuth, updateUser);
router.delete("/delete/:id", jwtAuth, deleteUser);
router.get("/:id", jwtAuth, getUser);
router.get("/", jwtAuth, getAllUsers);

export default router;
