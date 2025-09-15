import express from "express";

import { authMiddleware } from "../middleware/authMiddleware.js";
import {getCardDesign,getAllCardDesign} from "../controllers/carddesign/cardDesignController.js";
import { updateBasicDetails, createOrUpdateMainButton, createOrUpdateWhatsappButton } from "../controllers/carddesign/aboutController.js"
import { updateLinkSection,updateYouTubeSection,updateTextSection,saveGallerySection,savePhotoSection,deletePhoto} from "../controllers/carddesign/contentController.js"
import {  getThemes,updateHeaderSection, updateFontSection,updateThemesSection, saveProfileSection,saveBannerImgSection} from "../controllers/carddesign/styleController.js";
import { updateSettings } from "../controllers/carddesign/settingsController.js"

import { authorizeRoles } from "../middleware/roleMiddleWare.js";

import photoUpload from "../middleware/photoUpload.js";
import galleryUpload from "../middleware/galleryUpload.js";
import profileUpload from "../middleware/profileUpload.js";
import bannerUpload from "../middleware/bannerUpload.js";


const router = express.Router();

router.get("/card-design", getCardDesign);
router.get("/all-card-design", getAllCardDesign);


//card design student and admin adding routes
//for card design about section 
router.put("/basic", updateBasicDetails);
router.post("/mainbutton", createOrUpdateMainButton);
router.post("/whatsappButton", createOrUpdateWhatsappButton);

//for card design content section
router.put("/textSection", updateTextSection);
router.put("/linkSection", updateLinkSection);
router.put("/youTubeSection", updateYouTubeSection);
router.post("/gallerySection", galleryUpload.single("image"), saveGallerySection);
router.put("/photoSection", photoUpload.array("photos", 10), savePhotoSection);
router.delete("/deletephoto",deletePhoto);



//for card design styles section
router.put("/profileSection", profileUpload.single("profileImg"), saveProfileSection);
router.put("/bannerSection", bannerUpload.single("bannerImg"), saveBannerImgSection);
router.put("/header", updateHeaderSection);
router.put("/font", updateFontSection);
router.put("/themesSection", updateThemesSection);
router.get("/themes", getThemes);



//for card design settings section
router.put("/settings", updateSettings);


export default router;