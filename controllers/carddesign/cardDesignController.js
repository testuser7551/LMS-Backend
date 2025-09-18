import CardDesign from "../../models/CardDesigner.js";
import User from "../../models/User.js"


// Get single card design for students
export const getCardDesign = async (req, res) => {
  try {
    // console.log(req.user)
    const user = await User.findById(req.user._id);
    if (!user || !user.webcard_id) {
      return res.status(404).json({ message: "No Webcard found for this user" });
    }
    const cardDesign = await CardDesign.findById(user.webcard_id);
    res.status(200).json(cardDesign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get all Card Design for admin
export const getAllCardDesign = async (req, res) => {
  try {
    // const cardDesigns = await CardDesign.findAll();
    const cardDesigns = await CardDesign.find(); 
    if (!cardDesigns || cardDesigns.length === 0) {
      return res.status(404).json({ message: "No card designs found" });
    }
    res.status(200).json({
      success: true,
      count: cardDesigns.length,
      data: cardDesigns,
    });
    
  } catch (error) {
    console.error("Error fetching card designs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch card designs",
      error: error.message,
    });
  }
};

// Get single card design for students
// Get card design by ID (not by logged-in user)
export const getCardDesignById = async (req, res) => {
  try {
    const { id } = req.params; // get id from route parameter

    const cardDesign = await CardDesign.findById(id);
    if (!cardDesign) {
      return res.status(404).json({ message: "Card design not found" });
    }

    res.status(200).json(cardDesign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


