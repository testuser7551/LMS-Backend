import Webcard from "../models/CardDesigner.js";
import User from "../models/User.js";

// ---------------- POST (Create / Update mainButton) ----------------
export const createOrUpdateMainButton = async (req, res) => {
  try {
    const id = await User.findById(req.userId);
    const data = req.body;     // { buttonType, buttonText, buttonInput }

    // 1. Find the user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Get the webcard_id from user
    if (!user.webcard_id) {
      return res.status(404).json({ message: "User does not have a linked webcard" });
    }

    // 3. Update the webcard
    const webcard = await Webcard.findByIdAndUpdate(
      user.webcard_id,
      { $set: { "about.mainButton": data } },
      { new: true }
    );

    if (!webcard) {
      return res.status(404).json({ message: "Webcard not found" });
    }

    // 4. Respond with updated mainButton
    res.status(200).json(webcard.about.mainButton);
  } catch (error) {
    console.error("MainButton Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};


// ---------------- GET (Fetch mainButton) ----------------
export const getMainButton = async (req, res) => {
  try {
    const id = await User.findById(req.userId);
    // 1. Find user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.webcard_id) {
      return res.status(404).json({ message: "User does not have a linked webcard" });
    }

    // 2. Find webcard
    const webcard = await Webcard.findById(user.webcard_id);
    if (!webcard) {
      return res.status(404).json({ message: "Webcard not found" });
    }

    res.status(200).json(webcard.about.mainButton || {});
  } catch (error) {
    console.error("Get MainButton Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// ---------------- DELETE (Remove mainButton) ----------------
export const deleteMainButton = async (req, res) => {
  try {
    const id = await User.findById(req.userId);
    // 1. Find user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.webcard_id) {
      return res.status(404).json({ message: "User does not have a linked webcard" });
    }

    // 2. Update webcard
    const webcard = await Webcard.findByIdAndUpdate(
      user.webcard_id,
      { $unset: { "about.mainButton": "" } },
      { new: true }
    );

    if (!webcard) {
      return res.status(404).json({ message: "Webcard not found" });
    }

    res.status(200).json({ message: "Main button deleted successfully" });
  } catch (error) {
    console.error("Delete MainButton Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};