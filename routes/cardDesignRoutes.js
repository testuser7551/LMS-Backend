import express from "express";
import {
  getCardDesign,
  // getCardDesignById,
} from "../controllers/cardDesignController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getCardDesign);

// router.get("/:id", getCardDesignById);

export default router;