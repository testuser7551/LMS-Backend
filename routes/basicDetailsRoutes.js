import express from "express";
import {
  getBasicDetails,
  createOrUpdateBasicDetails,
  updateBasicDetails,
  deleteBasicDetails,
} from "../controllers/basicDetailsController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: BasicDetails
 *   description: Manage user basic details inside Webcard
 */
router.use(authMiddleware);
router.get("/", getBasicDetails);
router.post("/", createOrUpdateBasicDetails);
router.put("/", updateBasicDetails);
router.delete("/", deleteBasicDetails);

export default router;
