import express from "express";
import {
  getWhatsappButton,
  createOrUpdateWhatsappButton,
  updateWhatsappButton,
  deleteWhatsappButton,
} from "../controllers/whatsappButtonController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: WhatsappButton
 *   description: Manage WhatsApp Button in Digital Card
 */

/**
 * @swagger
 * /api/whatsappButton/{studentId}:
 *   get:
 *     summary: Get WhatsApp button by studentId
 *     tags: [WhatsappButton]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *   post:
 *     summary: Create or update WhatsApp button
 *     tags: [WhatsappButton]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               whatsappNumber:
 *                 type: string
 *               message:
 *                 type: string
 *               isEnabled:
 *                 type: boolean
 *   put:
 *     summary: Update existing WhatsApp button
 *     tags: [WhatsappButton]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *   delete:
 *     summary: Delete WhatsApp button
 *     tags: [WhatsappButton]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 */
router.use(authMiddleware);
router.get("/", getWhatsappButton);
router.post("/", createOrUpdateWhatsappButton);
router.put("/", updateWhatsappButton);
router.delete("/", deleteWhatsappButton);

export default router;
