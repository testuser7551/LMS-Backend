// routes/photoSectionRoutes.js
import express from "express";
import { savePhotoSection } from "../controllers/photoSectionController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import photoUpload from "../middleware/photoUpload.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: PhotoSection
 *   description: Manage Photo Section in Digital Card
 */

/**
 * @swagger
 * /api/photoSection:
 *   post:
 *     summary: Upload and save photos to PhotoSection
 *     tags: [PhotoSection]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: photos
 *         type: file
 *         required: true
 *         description: Multiple photo files
 *       - in: formData
 *         name: isEnabled
 *         type: boolean
 *         description: Enable or disable photo section
 */
router.use(authMiddleware);
router.post("/", photoUpload.array("photos", 10), savePhotoSection);

export default router;
