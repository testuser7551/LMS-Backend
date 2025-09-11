import express from "express";
import {
  getMainButton,
  createOrUpdateMainButton,
  deleteMainButton,
} from "../controllers/mainButtonController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: MainButton
 *   description: Manage main button inside CardDesign
 */
router.use(authMiddleware);
router.get("/", getMainButton);
router.post("/", createOrUpdateMainButton);
router.delete("/", deleteMainButton);

export default router;
