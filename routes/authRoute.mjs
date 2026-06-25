import express from "express";
import { authController, getMe, updateMe } from "../controller/authController.mjs";
import authMiddleware from "../middleware/auth.mjs";

const router = express.Router();

router.post("/login", authController);
router.get("/me", authMiddleware, getMe);
router.put("/me", authMiddleware, updateMe);

export default router;
