import express from "express";
import {
  updateYouTubeSection
} from "../controllers/youTubeSectionController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();


router.use(authMiddleware);

router.put("/", updateYouTubeSection);

export default router;
