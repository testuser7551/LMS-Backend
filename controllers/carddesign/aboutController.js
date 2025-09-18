import Webcard from "../../models/CardDesigner.js";
import User from "../../models/User.js";




// ---------------- UPDATE existing basicdetails ----------------
export const updateBasicDetails = async (req, res) => {
    try {
        const id = await User.findById(req.user._id);
        const data = req.body; // fields to update

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (!user.webcard_id)
            return res.status(404).json({ message: "User does not have a linked webcard" });

        let webcard = await Webcard.findByIdAndUpdate(
            user.webcard_id,
            {
                $set: Object.fromEntries(
                    Object.entries(data).map(([k, v]) => [`about.basicdetails.${k}`, v])
                ),
            },
            { new: true }
        );
        // If webcard is missing, recreate it
        if (!webcard) {
            webcard = await Webcard.create({
                about: { basicdetails: data },
            });
            user.webcard_id = webcard._id;
            await user.save();
        }

        res.status(200).json(webcard.about.basicdetails);
    } catch (err) {
        console.error("Update BasicDetails Error:", err.message);
        res.status(500).json({ message: err.message });
    }
};


// ---------------- POST (Create / Update mainButton) ----------------
export const createOrUpdateMainButton = async (req, res) => {
    try {
        const id = await User.findById(req.user._id);
        const data = req.body;

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

// ---------------- CREATE / UPDATE whatsappButton ----------------
export const createOrUpdateWhatsappButton = async (req, res) => {
    try {
        const id = await User.findById(req.user._id);
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