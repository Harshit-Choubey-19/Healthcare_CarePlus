import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  bookAppointment,
  cancelAppointment,
  hospitals,
  rescheduleAppointment,
} from "../controllers/hospitalController.js";
import { appointmentProtectRoute } from "../middleware/appointmentProtectRoute.js";
const router = express.Router();

router.get("/nearby", protectRoute, appointmentProtectRoute, hospitals);
router.post(
  "/book-appointment/:hospitalId",
  protectRoute,
  appointmentProtectRoute,
  bookAppointment
);
router.post(
  "/cancel-appointment/:appointmentId",
  protectRoute,
  appointmentProtectRoute,
  cancelAppointment
);
router.post(
  "/reschedule-appointment/:appointmentId",
  protectRoute,
  appointmentProtectRoute,
  rescheduleAppointment
);

export default router;
