import CardDesign from "../models/CardDesigner.js";
import User from "../models/User.js"


// Get all
export const getCardDesign = async (req, res) => {
  try {

    const user = await User.findById(req.userId);
    if (!user || !user.webcard_id) {
      return res.status(404).json({ message: "No Webcard found for this user" });
    }
    const cardDesign = await CardDesign.findById(user.webcard_id);
    res.status(200).json(cardDesign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get by ID
// export const getCardDesignById = async (req, res) => {
//   try {
//     const cardDesign = await CardDesign.findById(req.params.id);
//     if (!cardDesign) return res.status(404).json({ message: "Not found" });
//     res.status(200).json(cardDesign);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
