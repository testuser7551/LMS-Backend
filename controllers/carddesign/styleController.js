import Webcard from "../../models/CardDesigner.js";
import User from "../../models/User.js";
import Theme from "../../models/ThemeSchema.js";
import path from "path";
import fs from "fs";

const getUserWithWebcard = async (userId) => {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");
    if (!user.webcard_id) throw new Error("User does not have a linked webcard");
    return user;
};

//get themes 
export const getThemes = async (req, res) => {
    try {
        const themes = await Theme.find();
        res.json(themes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const saveProfileSection = async (req, res) => {
    try {
        const user = await getUserWithWebcard(req.user._id);

        const { profileShapes, profileRingOnPhoto, profileVerified } = req.body;

        // Find webcard
        const webcard = await Webcard.findById(user.webcard_id);
        if (!webcard) {
            return res.status(404).json({ success: false, message: "Webcard not found" });
        }

        let imgUrl = webcard.style?.profileSection?.profileImgUrl || null;

        // If new file uploaded → replace old one
        // if (req.file) {
        //     if (imgUrl) {
        //         const oldPath = path.join(process.cwd(), imgUrl.replace(/^\/+/, "")); // strip leading /
        //         if (fs.existsSync(oldPath)) {
        //             fs.unlinkSync(oldPath);
        //         }
        //     }
        //     imgUrl = `/uploads/profile/${req.file.filename}`;
        // }
        if (req.file) {
            // Case 1: new file uploaded → replace old
            if (imgUrl) {
                const oldPath = path.join(process.cwd(), imgUrl.replace(/^\/+/, ""));
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }
            imgUrl = `/uploads/profile/${req.file.filename}`;
        } else {
            // Case 2: no file provided → remove old one if exists
            if (imgUrl) {
                const oldPath = path.join(process.cwd(), imgUrl.replace(/^\/+/, ""));
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
                imgUrl = null; // clear from DB too
            }
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

export const updateHeaderSection = async (req, res) => {
    try {
        const user = await getUserWithWebcard(req.user._id);
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
        const user = await getUserWithWebcard(req.user._id);
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


export const saveBannerImgSection = async (req, res) => {
    try {
        const user = await getUserWithWebcard(req.user._id);

        // Find webcard
        const webcard = await Webcard.findById(user.webcard_id);
        if (!webcard) {
            return res.status(404).json({ success: false, message: "Webcard not found" });
        }

        let imgUrl = webcard.style?.bannerImgUrl || null;

        // If new file uploaded → replace old one
        if (req.body.bannerImg === "") {
            if (imgUrl) {
                const oldPath = path.join(process.cwd(), imgUrl.replace(/^\/+/, ""));
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            imgUrl = null; // clear in DB
        }

        // 🟢 CASE 2: New file uploaded → replace old one
        else if (req.file) {
            if (imgUrl) {
                const oldPath = path.join(process.cwd(), imgUrl.replace(/^\/+/, ""));
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            imgUrl = `/uploads/banner/${req.file.filename}`;
        }


        // Update banner section
        webcard.style.bannerImgUrl = imgUrl,
        await webcard.save();
        res.status(201).json({
            success: true,
            bannerImgUrl: webcard.style.bannerImgUrl,
        });
    } catch (err) {
        console.error("Save BannerSection Error:", err.message);
        res.status(500).json({ success: false, message: err.message });
    }
};


export const updateThemesSection = async (req, res) => {
    try {
        // Find user
        const user = await getUserWithWebcard(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (!user.webcard_id) {
            return res
                .status(404)
                .json({ message: "User does not have a linked webcard" });
        }

        // Get theme data from request body
        const updates = req.body; // { themeName, themeId?, primaryColor, secondaryColor, territoryColor, backgroundColor, textColor }

        // Update the Webcard's themesSection
        const webcard = await Webcard.findByIdAndUpdate(
            user.webcard_id,
            {
                $set: {
                    "style.themesSection.themeName": updates.themeName,
                    "style.themesSection.themeId": updates.themeId || null,
                    "style.themesSection.primaryColor": updates.primaryColor || null,
                    "style.themesSection.secondaryColor": updates.secondaryColor || null,
                    "style.themesSection.territoryColor": updates.territoryColor || null,
                    "style.themesSection.backgroundColor": updates.backgroundColor || null,
                    "style.themesSection.textColor": updates.textColor || null,
                },
            },
            { new: true }
        );

        if (!webcard) return res.status(404).json({ message: "Webcard not found" });

        // console.log("Updated Themes Section:", webcard.style.themesSection);

        res.status(200).json(webcard.style.themesSection);
    } catch (error) {
        console.error("Update Themes Section Error:", error.message);
        res.status(500).json({ message: error.message });
    }
};
