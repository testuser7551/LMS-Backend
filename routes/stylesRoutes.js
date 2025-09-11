// // routes/StylesRoutes.js
// import express from "express";
// import { updateSection } from "../controllers/styleController.js";

// const router = express.Router();

// // Save / update section
// router.put("/:id/:section", updateSection);

// export default router;

import express from "express";
import { updateProfileSection, updateHeaderSection, updateFontSection, updateBannerImgSection} from "../controllers/styleController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { updateThemesSection } from "../controllers/themeController.js";

const router = express.Router();

router.use(authMiddleware);

// GET profile section
// router.get("/profile", getProfileSection);

// PUT update profile section
router.put("/profile", updateProfileSection);
router.put("/header", updateHeaderSection);
router.put("/font", updateFontSection);
router.put("/banner", updateBannerImgSection);
router.put("/themesSection", updateThemesSection);


export default router;
