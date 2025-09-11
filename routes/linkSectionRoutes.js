import express from "express";
import {
  updateLinkSection,
} from "../controllers/linkSectionController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: LinkSection
 *   description: Manage Link Section in Digital Card
 */

/**
 * @swagger
 * /api/linkSection/{id}:
 *   put:
 *     summary: Update existing LinkSection
 *     tags: [LinkSection]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.use(authMiddleware);

router.put("/", updateLinkSection);

export default router;
