import path from "path";
import fs from "fs";

import Webcard from "../../models/CardDesigner.js";
import User from "../../models/User.js";

// 🔹 Common helper for fetching user + webcard
const getUserWithWebcard = async (userId) => {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");
    if (!user.webcard_id) throw new Error("User does not have a linked webcard");
    return user;
};


// ---------------- UPDATE existing linkSection ----------------
export const updateLinkSection = async (req, res) => {
    try {
        const data = req.body; // partial update
        const user = await getUserWithWebcard(req.user._id);
        console.log(data);
        const updateFields = {};
        if (data.title && typeof data.title !== "string") {
            return res.status(400).json({ message: "Title must be a string" });
        }
        if (data.link && typeof data.link !== "string") {
            return res.status(400).json({ message: "Link must be a string" });
        }

        if (data.title !== undefined)
            updateFields["content.linksSection.title"] = data.title;
        if (data.link !== undefined)
            updateFields["content.linksSection.link"] = data.link;
        if (data.isEnabled !== undefined)
            updateFields["content.linksSection.isEnabled"] = data.isEnabled;

        const webcard = await Webcard.findByIdAndUpdate(
            user.webcard_id,
            { $set: updateFields },
            { new: true }
        );

        if (!webcard) return res.status(404).json({ message: "Webcard not found" });

        res.status(200).json(webcard.content.linksSection || {});
    } catch (err) {
        console.error("Update LinkSection Error:", err.message);
        res.status(500).json({ message: err.message });
    }
};

// ---------------- UPDATE existing youtubeSection ----------------
export const updateYouTubeSection = async (req, res) => {
    try {
        const id = await User.findById(req.user._id);
        const data = req.body;
        // console.log()
        const user = await getUserWithWebcard(id);
        console.log(data);
        const updateFields = Object.fromEntries(
            Object.entries(data).map(([k, v]) => [`content.youtubeSections.${k}`, v])
        );

        const webcard = await Webcard.findByIdAndUpdate(
            user.webcard_id,
            { $set: updateFields },
            { new: true }
        );

        if (!webcard) return res.status(404).json({ message: "Webcard not found" });

        res.status(200).json(webcard?.content?.youtubeSections || {});
    } catch (err) {
        console.error("Update YouTube Section Error:", err.message);
        res.status(500).json({ message: err.message });
    }
};

// ---------------- UPDATE existing textSection ----------------

export const updateTextSection = async (req, res) => {
    try {
        const id = await User.findById(req.user._id);
        const data = req.body;

        const user = await getUserWithWebcard(id);

        const updateFields = Object.fromEntries(
            Object.entries(data).map(([k, v]) => [`content.textSection.${k}`, v])
        );

        const webcard = await Webcard.findByIdAndUpdate(
            user.webcard_id,
            { $set: updateFields },
            { new: true }
        );

        if (!webcard) return res.status(404).json({ message: "Webcard not found" });

        res.status(200).json(webcard?.content?.textSection || {});
    } catch (err) {
        console.error("Update TextSection Error:", err.message);
        res.status(500).json({ message: err.message });
    }
};


// ---------------- SAVE / UPDATE Gallery Section ----------------
export const saveGallerySection = async (req, res) => {
  try {
    const user = await getUserWithWebcard(req.user._id);

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image uploaded" });
    }

    const fileName = req.file.filename;
    const imgUrl = `/uploads/gallery/${fileName}`;
    const isEnabled = req.body.isEnabled === "true";

    // Find webcard
    const webcard = await Webcard.findById(user.webcard_id);
    if (!webcard) {
      return res.status(404).json({ success: false, message: "Webcard not found" });
    }

    // If old image exists → delete it
    if (webcard.content?.gallerySections?.imgUrl) {
      const oldPath = path.join(process.cwd(), webcard.content.gallerySections.imgUrl);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    // Update gallery section
    webcard.content.gallerySections = {
      imgUrl,
      isEnabled,
    };

    await webcard.save();

    res.status(201).json({
      success: true,
      gallerySections: webcard.content.gallerySections,
    });
  } catch (err) {
    console.error("Save GallerySection Error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};



// ---------------- SAVE Photo Section ----------------
export const savePhotoSection = async (req, res) => {
  try {
    const user = await getUserWithWebcard(req.user._id);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No photos uploaded" });
    }

    const imgUrls = req.files.map((file) => `/uploads/photos/${file.filename}`);
    const isEnabled = req.body.isEnabled === "true";

    const webcard = await Webcard.findByIdAndUpdate(
      user.webcard_id,
      {
        $push: {
          "content.photoSections.imgUrls": { $each: imgUrls }
        },
        $set: {
          "content.photoSections.isEnabled": isEnabled
        }
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


export const deletePhoto = async (req, res) => {
  try {
    const user = await getUserWithWebcard(req.userId);
    const { filename } = req.body;  // ✅ from body, not params

    if (!filename) {
      return res.status(400).json({ message: "Filename is required" });
    }

    const photoPath = `/uploads/photos/${filename}`;

    // 1️⃣ Update DB → Remove filename from array
    const webcard = await Webcard.findByIdAndUpdate(
      user.webcard_id,
      { $pull: { "content.photoSections.imgUrls": photoPath } },
      { new: true }
    );

    if (!webcard) {
      return res.status(404).json({ message: "Webcard not found" });
    }

    // 2️⃣ Delete from folder if exists
    const absolutePath = path.join(process.cwd(), "uploads", "photos", filename);
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }

    res.status(200).json({
      success: true,
      message: "Photo deleted successfully",
      photoSection: webcard.content.photoSections,
    });
  } catch (err) {
    console.error("Photo Delete Error:", err.message);
    res.status(500).json({ message: err.message });
  }
};
