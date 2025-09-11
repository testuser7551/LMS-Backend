import Webcard from "../models/CardDesigner.js"; 
import User from "../models/User.js";

// 🔹 Common helper for fetching user + webcard
const getUserWithWebcard = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  if (!user.webcard_id) throw new Error("User does not have a linked webcard");
  return user;
};

// ---------------- UPDATE existing textSection ----------------
export const updateYouTubeSection = async (req, res) => {
  try {
    const id = await User.findById(req.userId);
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
