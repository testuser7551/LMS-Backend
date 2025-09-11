import express from "express";
import {
  updateTextSection,
} from "../controllers/textSectionController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: TextSection
 *   description: Manage Text Section in Digital Card
 */

/**
 * @swagger
 * /api/textSection:
 *   put:
 *     summary: Update existing TextSection
 *     tags: [TextSection]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 
 */
router.use(authMiddleware);
router.put("/", updateTextSection);

export default router;
