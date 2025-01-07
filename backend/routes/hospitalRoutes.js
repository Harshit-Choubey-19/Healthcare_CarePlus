import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  bookAppointment,
  cancelAppointment,
  getAllAppointment,
  getOneAppointment,
  hospitals,
  rescheduleAppointment,
  successPage,
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
router.get(
  "/successPage/:hospitalId",
  protectRoute,
  appointmentProtectRoute,
  successPage
);
router.get(
  "/appointmentDetail/:hospitalId",
  protectRoute,
  appointmentProtectRoute,
  getOneAppointment
);
router.get(
  "/allAppointments/:hospitalId",
  protectRoute,
  appointmentProtectRoute,
  getAllAppointment
);

export default router;
