import express from "express";
import {
  login,
  register,
  verifyEmailToken,
} from "../controllers/authControllers.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/user/:id/verify/:token", verifyEmailToken);

export default router;
