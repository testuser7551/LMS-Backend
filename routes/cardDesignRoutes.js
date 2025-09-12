import express from "express";
import {
  getCardDesign,
  getAllCardDesign,
  // getCardDesignById,
} from "../controllers/cardDesignController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/card-design", getCardDesign);
router.get("/all-card-design",getAllCardDesign);

export default router;