// // routes/StylesRoutes.js
// import express from "express";
// import { updateSection } from "../controllers/styleController.js";

// const router = express.Router();

// // Save / update section
// router.put("/:id/:section", updateSection);

// export default router;

import express from "express";
import multer from "multer";
import path from "path";
import {  updateHeaderSection, updateFontSection} from "../controllers/styleController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { updateThemesSection } from "../controllers/themeController.js";

const router = express.Router();

router.use(authMiddleware);


// GET profile section
// router.get("/profile", getProfileSection);

// PUT update profile section
router.put("/header", updateHeaderSection);
router.put("/font", updateFontSection);
router.put("/themesSection", updateThemesSection);


export default router;
