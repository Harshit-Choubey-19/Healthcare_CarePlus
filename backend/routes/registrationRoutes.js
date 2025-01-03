import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { register } from "../controllers/registrationController.js";

const router = express.Router();

router.post("/", protectRoute, register);

export default router;
