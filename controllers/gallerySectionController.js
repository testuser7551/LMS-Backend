// // // import Webcard from "../models/CardDesigner.js"; 
// // // import User from "../models/User.js";

// // // // 🔹 Common helper for fetching user + webcard
// // // const getUserWithWebcard = async (userId) => {
// // //   const user = await User.findById(userId);
// // //   if (!user) throw new Error("User not found");
// // //   if (!user.webcard_id) throw new Error("User does not have a linked webcard");
// // //   return user;
// // // };

// // // // ---------------- UPDATE existing GallerySection ----------------
// // // export const updateGallerySection = async (req, res) => {
// // //   try {
// // //     const id = await User.findById(req.userId); // authMiddleware sets req.userId
// // //     const data = req.body; // { imgUrl, isEnabled }

// // //     const user = await getUserWithWebcard(id);

// // //     // Map request body into `content.gallerySections`
// // //     const updateFields = Object.fromEntries(
// // //       Object.entries(data).map(([k, v]) => [`content.gallerySections.${k}`, v])
// // //     );

// // //     const webcard = await Webcard.findByIdAndUpdate(
// // //       user.webcard_id,
// // //       { $set: updateFields },
// // //       { new: true }
// // //     );

// // //     if (!webcard) {
// // //       return res.status(404).json({ message: "Webcard not found" });
// // //     }

// // //     res.status(200).json(webcard?.content?.gallerySections || {});
// // //   } catch (err) {
// // //     console.error("Update GallerySection Error:", err.message);
// // //     res.status(500).json({ message: err.message });
// // //   }
// // // };


// // export const updateGallerySection = async (req, res) => {
// //   try {
// //     const id = req.userId; // authMiddleware sets req.userId
// //     const data = req.body; // { imgUrl, isEnabled }

// //     // 🔹 Guard against empty body
// //     if (!data || Object.keys(data).length === 0) {
// //       return res.status(400).json({ message: "Request body is empty" });
// //     }

// //     const user = await getUserWithWebcard(id);

// //     // Map request body into `content.gallerySections`
// //     const updateFields = {};
// //     if (data.imgUrl !== undefined) {
// //       updateFields["content.gallerySections.imgUrl"] = data.imgUrl;
// //     }
// //     if (data.isEnabled !== undefined) {
// //       updateFields["content.gallerySections.isEnabled"] = data.isEnabled;
// //     }

// //     const webcard = await Webcard.findByIdAndUpdate(
// //       user.webcard_id,
// //       { $set: updateFields },
// //       { new: true }
// //     );

// //     if (!webcard) {
// //       return res.status(404).json({ message: "Webcard not found" });
// //     }

// //     res.status(200).json(webcard?.content?.gallerySections || {});
// //   } catch (err) {
// //     console.error("Update GallerySection Error:", err.message);
// //     res.status(500).json({ message: err.message });
// //   }
// // };


// import Webcard from "../models/CardDesigner.js"; 
// import User from "../models/User.js";

// // 🔹 Reuse helper
// const getUserWithWebcard = async (userId) => {
//   const user = await User.findById(userId);
//   if (!user) throw new Error("User not found");
//   if (!user.webcard_id) throw new Error("User does not have a linked webcard");
//   return user;
// };

// // ---------------- UPDATE existing GallerySection ----------------
// export const updateGallerySection = async (req, res) => {
//   try {
//     const user = await getUserWithWebcard(req.userId); // ✅ fix: pass req.userId directly
//     const data = req.body; // { imgUrl, isEnabled }

//     if (!data || Object.keys(data).length === 0) {
//       return res.status(400).json({ message: "Request body is empty" });
//     }

//     // Map request body into `content.gallerySections`
//     const updateFields = Object.fromEntries(
//       Object.entries(data).map(([k, v]) => [`content.gallerySections.${k}`, v])
//     );

//     const webcard = await Webcard.findByIdAndUpdate(
//       user.webcard_id,
//       { $set: updateFields },
//       { new: true }
//     );

//     if (!webcard) {
//       return res.status(404).json({ message: "Webcard not found" });
//     }

//     res.status(200).json(webcard?.content?.gallerySections || {});
//   } catch (err) {
//     console.error("Update GallerySection Error:", err.message);
//     res.status(500).json({ message: err.message });
//   }
// };


import Webcard from "../models/CardDesigner.js";
import User from "../models/User.js";
import path from "path";
import fs from "fs";

// 🔹 Helper to get user + linked webcard
const getUserWithWebcard = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  if (!user.webcard_id) throw new Error("User does not have a linked webcard");
  return user;
};

// ---------------- SAVE or UPDATE Gallery Image ----------------
// ---------------- SAVE / UPDATE Gallery Section ----------------
export const saveGallerySection = async (req, res) => {
  try {
    const user = await getUserWithWebcard(req.userId);

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

// ---------------- DELETE Gallery Image ----------------
export const deleteGalleryImage = async (req, res) => {
  try {
    const user = await getUserWithWebcard(req.userId);
    const { imageId } = req.params;

    const webcard = await Webcard.findById(user.webcard_id);
    if (!webcard) {
      return res.status(404).json({ success: false, message: "Webcard not found" });
    }

    if (!webcard.content?.gallerySections?.imgUrl) {
      return res.status(404).json({ success: false, message: "No gallery image found" });
    }

    // Delete file from uploads
    const filePath = path.join(process.cwd(), "uploads", webcard.content.gallerySections.imgUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Clear DB fields
    webcard.content.gallerySections = {
      imgUrl: null,
      isEnabled: false,
    };

    await webcard.save();

    res.status(200).json({ success: true, message: "Gallery image deleted successfully" });
  } catch (err) {
    console.error("Delete GallerySection Error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
