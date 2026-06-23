import express from "express";
import { authController, getMe } from "../controller/authController.mjs";
import authMiddleware from "../middleware/auth.mjs";

const router = express.Router();

router.post("/login", authController);
router.get("/me", authMiddleware, getMe);

export default router;
