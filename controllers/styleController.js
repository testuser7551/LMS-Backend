// // controllers/StylesController.js
// import CardDesign from "../models/CardDesigner.js";

// export const updateSection = async (req, res) => {
//   try {
//     const { id, section } = req.params; // cardDesignId and section name
//     const sectionData = req.body; // data from frontend

//     let updateQuery = {};

//     switch (section) {
//       case "profile":
//         updateQuery = {
//           "webCards.theme.bannerPhotoUrl": sectionData.profilePhoto,
//           "webCards.theme.bannerLayout": sectionData.profileShape,
//           "webCards.theme.showRingOnPhotoUrl": sectionData.showRing,
//           "webCards.theme.showVerifiedBadge": sectionData.showVerified,
//         };
//         break;

//       case "banner":
//         updateQuery = {
//           "webCards.theme.bannerPhotoUrl": sectionData.bannerPhoto,
//         };
//         break;

//       case "theme":
//         updateQuery = {
//           "webCards.theme.themeName": sectionData.themePreset,
//           "webCards.theme.backgroundColor": sectionData.backgroundColor,
//           "webCards.theme.textColor": sectionData.textColor,
//           "webCards.theme.primaryColor": sectionData.primaryColor,
//           "webCards.theme.secondaryColor": sectionData.secondaryColor,
//           "webCards.theme.territoryColor": sectionData.territoryColor,
//         };
//         break;

//       case "header":
//         updateQuery = {
//           "webCards.theme.headerStyle": sectionData.headerAlignment,
//           "webCards.theme.font": sectionData.fontFamily,
//         };
//         break;

//       default:
//         return res.status(400).json({ success: false, message: "Invalid section" });
//     }

//     const card = await CardDesign.findByIdAndUpdate(
//       id,
//       { $set: updateQuery },
//       { new: true }
//     );
//     console.log(updateQuery);
//     if (!card) {
//       return res.status(404).json({ success: false, message: "Card not found" });
//     }

//     res.json({ success: true, card });
//   } catch (err) {
//     console.error("Update Section Error:", err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// };


import Webcard from "../models/CardDesigner.js";
import User from "../models/User.js";

import path from "path";
import fs from "fs";

// Helper
const getUserWithWebcard = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  if (!user.webcard_id) throw new Error("User does not have a linked webcard");
  return user;
};



export const saveProfileSection = async (req, res) => {
  try {
    const user = await getUserWithWebcard(req.userId);

    const { profileShapes, profileRingOnPhoto, profileVerified } = req.body;

    // Find webcard
    const webcard = await Webcard.findById(user.webcard_id);
    if (!webcard) {
      return res.status(404).json({ success: false, message: "Webcard not found" });
    }

    let imgUrl = webcard.style?.profileSection?.profileImgUrl || null;

    // If new file uploaded → replace old one
    if (req.file) {
      if (imgUrl) {
        const oldPath = path.join(process.cwd(), imgUrl.replace(/^\/+/, "")); // strip leading /
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      imgUrl = `/uploads/profile/${req.file.filename}`;
    }

    // Update profile section
    webcard.style.profileSection = {
      profileImgUrl: imgUrl,
      profileShapes,
      profileRingOnPhoto: profileRingOnPhoto === "true",
      profileVerified: profileVerified === "true",
    };

    await webcard.save();

    res.status(201).json({
      success: true,
      profileSection: webcard.style.profileSection,
    });
  } catch (err) {
    console.error("Save ProfileSection Error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// // ---------------- GET Profile Section ----------------
// export const getProfileSection = async (req, res) => {
//   try {
//     const user = await User.findById(req.userId);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     if (!user.webcard_id) {
//       return res.status(404).json({ message: "User does not have a linked webcard" });
//     }

//     const webcard = await Webcard.findById(user.webcard_id).select("style.profileSection");
//     if (!webcard) return res.status(404).json({ message: "Webcard not found" });

//     res.status(200).json(webcard.style.profileSection);
//   } catch (error) {
//     console.error("ProfileSection GET Error:", error.message);
//     res.status(500).json({ message: error.message });
//   }
// };



// ---------------- PUT Update Header Style Section ----------------
export const updateHeaderSection = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.webcard_id) {
      return res.status(404).json({ message: "User does not have a linked webcard" });
    }

    const updates = req.body.headerStyleSection; // { headerStyle }

    const webcard = await Webcard.findByIdAndUpdate(
      user.webcard_id,
      {
        $set: {
          "style.headerStyleSection.headerStyle": updates.headerStyle,
        },
      },
      { new: true }
    );

    if (!webcard) return res.status(404).json({ message: "Webcard not found" });

    res.status(200).json(webcard.style.headerStyleSection);
  } catch (error) {
    console.error("HeaderStyleSection PUT Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// ---------------- PUT Update Font Style Section ----------------
export const updateFontSection = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.webcard_id) {
      return res
        .status(404)
        .json({ message: "User does not have a linked webcard" });
    }

    const updates = req.body.fontStyleSection; // { font }

    const webcard = await Webcard.findByIdAndUpdate(
      user.webcard_id,
      {
        $set: {
          "style.fontStyleSection.font": updates.font,
        },
      },
      { new: true }
    );

    if (!webcard) return res.status(404).json({ message: "Webcard not found" });

    res.status(200).json(webcard.style.fontStyleSection);
  } catch (error) {
    console.error("FontSection PUT Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// ---------------- PUT Update Banner Image Section ----------------
// export const updateBannerImgSection = async (req, res) => {
//   try {
//     const user = await User.findById(req.userId);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     if (!user.webcard_id) {
//       return res
//         .status(404)
//         .json({ message: "User does not have a linked webcard" });
//     }

//     const updates = req.body.bannerImgSection; // { bannerImgUrl }

//     const webcard = await Webcard.findByIdAndUpdate(
//       user.webcard_id,
//       {
//         $set: {
//           "style.bannerImgSection.bannerImgUrl": updates.bannerImgUrl,
//         },
//       },
//       { new: true }
//     );

//     if (!webcard) return res.status(404).json({ message: "Webcard not found" });

//     res.status(200).json({ bannerImgUrl: webcard.style.bannerImgUrl });
//   } catch (error) {
//     console.error("BannerImgSection PUT Error:", error.message);
//     res.status(500).json({ message: error.message });
//   }
// };

export const saveBannerImgSection = async (req, res) => {
  try {
    const user = await getUserWithWebcard(req.userId);

    // Find webcard
    const webcard = await Webcard.findById(user.webcard_id);
    if (!webcard) {
      return res.status(404).json({ success: false, message: "Webcard not found" });
    }

    let imgUrl = webcard.style?.bannerSection?.bannerImgUrl || null;

    // If new file uploaded → replace old one
    if (req.file) {
      if (imgUrl) {
        const oldPath = path.join(process.cwd(), imgUrl.replace(/^\/+/, ""));
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      imgUrl = `/uploads/banner/${req.file.filename}`;
    }

    // Update banner section
    webcard.style.bannerSection = {
      bannerImgUrl: imgUrl,
    };

    await webcard.save();

    res.status(201).json({
      success: true,
      bannerSection: webcard.style.bannerSection,
    });
  } catch (err) {
    console.error("Save BannerSection Error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};



