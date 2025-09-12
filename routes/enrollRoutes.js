import express from "express";
import { enrollUser, getEnrollments, getAllEnroll, deleteEnrollment } from "../controllers/enrollController.js";

const router = express.Router();

router.post("/enroll", enrollUser);
router.get("/:userId", getEnrollments);
router.get("/", getAllEnroll);
router.delete("/:userId/:courseId", deleteEnrollment);
export default router;
