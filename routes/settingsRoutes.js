import express from "express";
import {
  updateSettings,
  // deleteSettings,
} from "../controllers/settingsController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();


/**
 * @swagger
 * /settings:
 *   put:
 *     summary: Update Webcard settings
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Settings'
 *     responses:
 *       200:
 *         description: Settings updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *
 *   delete:
 *     summary: Delete Webcard settings
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Settings deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 */

router.use(authMiddleware); // protect all routes

// router.get("/", getSettings);
router.put("/", updateSettings);
// router.delete("/", deleteSettings);

export default router;
