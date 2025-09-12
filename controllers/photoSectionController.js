// controllers/photoSectionController.js
import Webcard from "../models/CardDesigner.js";
import User from "../models/User.js";
import fs from "fs";
import path from "path";

// ✅ Helper
const getUserWithWebcard = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  if (!user.webcard_id) throw new Error("User does not have a linked webcard");
  return user;
};

// ---------------- SAVE Photo Section ----------------
export const savePhotoSection = async (req, res) => {
  try {
    const user = await getUserWithWebcard(req.userId);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No photos uploaded" });
    }

    const imgUrls = req.files.map((file) => `/uploads/photos/${file.filename}`);
    const isEnabled = req.body.isEnabled === "true";

    const webcard = await Webcard.findByIdAndUpdate(
      user.webcard_id,
      {
        $set: {
          "content.photoSections.imgUrls": imgUrls,
          "content.photoSections.isEnabled": isEnabled,
        },
      },
      { new: true }
    );

    if (!webcard) {
      return res.status(404).json({ message: "Webcard not found" });
    }

    res.status(200).json({
      success: true,
      photoSection: webcard.content.photoSections,
    });
  } catch (err) {
    console.error("PhotoSection Save Error:", err.message);
    res.status(500).json({ message: err.message });
  }
};
