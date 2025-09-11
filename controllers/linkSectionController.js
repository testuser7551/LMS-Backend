
import Webcard from "../models/CardDesigner.js";
import User from "../models/User.js";

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
    const user = await getUserWithWebcard(req.userId);
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


