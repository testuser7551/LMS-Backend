// import CardDesign from "../models/CardDesigner.js";
// import Theme from "../models/ThemeSchema.js"; // Your Theme schema

// // Save / update themes section
// export const updateThemesSection = async (req, res) => {
//   try {
//     const { id } = req.params; // cardDesignId
//     const sectionData = req.body; // theme data from frontend

//     let updateQuery = {};

//     if (sectionData.themeName === "Custom") {
//       // Custom theme → create new Theme entry
//       const customTheme = new Theme({
//         themeName: "Custom",
//         primaryColor: sectionData.primaryColor,
//         secondaryColor: sectionData.secondaryColor,
//         territoryColor: sectionData.territoryColor,
//         backgroundColor: sectionData.backgroundColor,
//         textColor: sectionData.textColor,
//       });

//       await customTheme.save();

//       updateQuery = {
//         "webCards.theme.themesSection.themeName": "Custom",
//         "webCards.theme.themesSection.themeId": customTheme._id,
//         "webCards.theme.themesSection.primaryColor": sectionData.primaryColor,
//         "webCards.theme.themesSection.secondaryColor": sectionData.secondaryColor,
//         "webCards.theme.themesSection.territoryColor": sectionData.territoryColor,
//         "webCards.theme.themesSection.backgroundColor": sectionData.backgroundColor,
//         "webCards.theme.themesSection.textColor": sectionData.textColor,
//       };
//     } else {
//       // Predefined theme → fetch from DB
//       const theme = await Theme.findOne({ themeName: sectionData.themeName });
//       if (!theme) {
//         return res.status(404).json({ success: false, message: "Theme not found" });
//       }

//       updateQuery = {
//         "webCards.theme.themesSection.themeName": theme.themeName,
//         "webCards.theme.themesSection.themeId": theme._id,
//         "webCards.theme.themesSection.primaryColor": theme.primaryColor,
//         "webCards.theme.themesSection.secondaryColor": theme.secondaryColor,
//         "webCards.theme.themesSection.territoryColor": theme.territoryColor,
//         "webCards.theme.themesSection.backgroundColor": theme.backgroundColor,
//         "webCards.theme.themesSection.textColor": theme.textColor,
//       };
//     }

//     const card = await CardDesign.findByIdAndUpdate(
//       id,
//       { $set: updateQuery },
//       { new: true }
//     );

//     if (!card) {
//       return res.status(404).json({ success: false, message: "Card not found" });
//     }

//     res.json({ success: true, card });
//   } catch (err) {
//     console.error("Update Themes Section Error:", err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// };


// controllers/themeController.js
import Webcard from "../models/CardDesigner.js";
import User from "../models/User.js";

// ---------------- PUT Update Themes Section ----------------
export const updateThemesSection = async (req, res) => {
  try {
    // Find user
    const user = await User.findById(req.userId);
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
