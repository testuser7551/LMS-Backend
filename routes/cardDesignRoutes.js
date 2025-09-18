import express from "express";

import {getCardDesign,getAllCardDesign,getCardDesignById} from "../controllers/carddesign/cardDesignController.js";
import { updateBasicDetails, createOrUpdateMainButton, createOrUpdateWhatsappButton } from "../controllers/carddesign/aboutController.js"
import { updateLinkSection,updateYouTubeSection,updateTextSection,saveGallerySection,savePhotoSection,deletePhoto} from "../controllers/carddesign/contentController.js"
import {  getThemes,updateHeaderSection, updateFontSection,updateThemesSection, saveProfileSection,saveBannerImgSection} from "../controllers/carddesign/styleController.js";
import { updateContentAbout,saveExperienceSection,deleteExperience,updateExperienceMeta, updateExperienceById, isEnabledContent, getCertificates,updateCourseCertificates } from "../controllers/carddesign/contentAboutController.js"
import { updateSettings } from "../controllers/carddesign/settingsController.js"

import { authorizeRoles } from "../middleware/roleMiddleWare.js";

import photoUpload from "../middleware/photoUpload.js";
import galleryUpload from "../middleware/galleryUpload.js";
import profileUpload from "../middleware/profileUpload.js";
import bannerUpload from "../middleware/bannerUpload.js";


const router = express.Router();

router.get("/card-design/:id", getCardDesignById);


router.get("/all-card-design", getAllCardDesign);
router.get("/card-design", getCardDesign);


//card design student and admin adding routes
//for card design about section 
router.put("/basic", updateBasicDetails);
router.post("/mainbutton", createOrUpdateMainButton);
router.put("/whatsappbutton", createOrUpdateWhatsappButton);

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


// for content About Pages
router.put("/content/about", updateContentAbout);
router.post("/content/experience",saveExperienceSection);
router.put("/content/experience-title",updateExperienceMeta);
router.put("/content/experience/:experienceId",updateExperienceById);
router.delete("/content/experience/:experienceId",deleteExperience);

router.put("/content/isenabled", isEnabledContent);
router.get("/content/certificates", getCertificates);
router.put("/content/certification/courses", updateCourseCertificates);


export default router;