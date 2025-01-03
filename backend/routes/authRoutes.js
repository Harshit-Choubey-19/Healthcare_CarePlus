import express from "express";
import {
  login,
  logout,
  resendOtp,
  signup,
  verifyOtp,
} from "../controllers/authController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/verifyOtp", protectRoute, verifyOtp);
router.post("/resendOtp", protectRoute, resendOtp);

export default router;
