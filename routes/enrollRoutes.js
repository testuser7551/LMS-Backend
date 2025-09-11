import express from "express";
import { enrollUser, getEnrollments } from "../controllers/enrollController.js";

const router = express.Router();

router.post("/enroll", enrollUser);
router.get("/:userId", getEnrollments);

export default router;
