import express from "express";
import profileUpload from "../middleware/profileUpload.js";
import { saveProfileSection } from "../controllers/styleController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: ProfileSection
 *   description: Manage Profile Section in Digital Card
 */

router.use(authMiddleware);
router.put("/", profileUpload.single("profileImg"), saveProfileSection);

export default router;
