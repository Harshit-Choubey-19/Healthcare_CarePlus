import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  getMe,
  getMyAppointments,
  updateDetails,
} from "../controllers/profileController.js";

const router = express.Router();

router.get("/", protectRoute, getMe);
router.get("/myAppointments", protectRoute, getMyAppointments);
router.post("/update", protectRoute, updateDetails);

export default router;
