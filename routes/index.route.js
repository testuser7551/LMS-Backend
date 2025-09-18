//import common routes
import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { authMiddleware } from "../middleware/authMiddleware.js";

//import course routes
import courseRoutes from "./courseRoutes.js";


//import card design routes

import cardDesignRoutes from "./cardDesignRoutes.js"


const router = express.Router();

//Course Routes
router.use("/courses", courseRoutes);
//card design Routes
router.use("", cardDesignRoutes);









export default router;
