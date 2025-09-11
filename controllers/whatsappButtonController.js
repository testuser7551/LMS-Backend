



import Webcard from "../models/CardDesigner.js"; // Webcard model
import User from "../models/User.js";

// ---------------- GET whatsappButton ----------------
export const getWhatsappButton = async (req, res) => {
  try {
    const id = await User.findById(req.userId);

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.webcard_id) {
      return res.status(404).json({ message: "User does not have a linked webcard" });
    }

    const webcard = await Webcard.findById(user.webcard_id);
    if (!webcard) return res.status(404).json({ message: "Webcard not found" });

    res.status(200).json(webcard.about?.whatsappButton || {});
  } catch (err) {
    console.error("Get WhatsappButton Error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// ---------------- CREATE / UPDATE whatsappButton ----------------
export const createOrUpdateWhatsappButton = async (req, res) => {
  try {
    const id = await User.findById(req.userId);
    const data = req.body;     // { whatsappNumber, message, isEnabled }

    const user = await User.findById(id); // ✅ FIXED
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.webcard_id) {
      return res.status(404).json({ message: "User does not have a linked webcard" });
    }

    const webcard = await Webcard.findByIdAndUpdate(
      user.webcard_id,
      { $set: { "about.whatsappButton": data } },
      { new: true }
    );

    if (!webcard) return res.status(404).json({ message: "Webcard not found" });

    res.status(200).json(webcard.about.whatsappButton);
  } catch (err) {
    console.error("Create/Update WhatsappButton Error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// ---------------- UPDATE existing whatsappButton ----------------
export const updateWhatsappButton = async (req, res) => {
  try {
    const id = await User.findById(req.userId);
    const data = req.body; // e.g. { message: "new text" }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.webcard_id) {
      return res.status(404).json({ message: "User does not have a linked webcard" });
    }

    const updateFields = Object.fromEntries(
      Object.entries(data).map(([k, v]) => [`about.whatsappButton.${k}`, v])
    );

    const webcard = await Webcard.findByIdAndUpdate(
      user.webcard_id,
      { $set: updateFields },
      { new: true }
    );

    if (!webcard) return res.status(404).json({ message: "Webcard not found" });

    res.status(200).json(webcard.about.whatsappButton);
  } catch (err) {
    console.error("Update WhatsappButton Error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// ---------------- DELETE whatsappButton ----------------
export const deleteWhatsappButton = async (req, res) => {
  try {
    const id = await User.findById(req.userId);
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.webcard_id) {
      return res.status(404).json({ message: "User does not have a linked webcard" });
    }

    const webcard = await Webcard.findByIdAndUpdate(
      user.webcard_id,
      { $unset: { "about.whatsappButton": "" } },
      { new: true }
    );

    if (!webcard) return res.status(404).json({ message: "Webcard not found" });

    res.status(200).json({ message: "WhatsappButton deleted successfully" });
  } catch (err) {
    console.error("Delete WhatsappButton Error:", err.message);
    res.status(500).json({ message: err.message });
  }
};
