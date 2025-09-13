import express from "express";
import bannerUpload from "../middleware/bannerUpload.js";
import { saveBannerImgSection } from "../controllers/styleController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();


/**
 * @swagger
 * tags:
 *   name: bannerSection updation
 *   description: Manage Banner Section in Digital Card
 */

router.use(authMiddleware);

// PUT request for updating banner
router.put("/", bannerUpload.single("bannerImg"), saveBannerImgSection);

export default router;
