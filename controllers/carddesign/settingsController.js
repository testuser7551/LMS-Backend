import Webcard from "../../models/CardDesigner.js";
import User from "../../models/User.js";


// Update settings
export const updateSettings = async (req, res) => {
  try {
    const { settings } = req.body;
    const user = await User.findById(req.user._id);
    // console.log(settings);
    if (!user || !user.webcard_id) {
      return res.status(404).json({ message: "No Webcard found for this user" });
    }


    const webcard = await Webcard.findByIdAndUpdate(
      user.webcard_id,
      { $set: { settings: settings } },
      { new: true }
    );
    console.log(webcard);
    if (!webcard) {
      return res.status(404).json({ message: "Webcard not found" });
    }

    res.json(webcard.settings);
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).json({ message: "Server error" });
  }
};
