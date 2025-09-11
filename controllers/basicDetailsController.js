// import Webcard from "../models/CardDesigner.js";
// import User from "../models/User.js";

// // ---------------- CREATE / UPDATE basicdetails ----------------
// export const createOrUpdateBasicDetails = async (req, res) => {
//   try {
//     const { id } = req.params; // USER ID
//     const data = req.body;     // { name, email, mobilenumber, jobTitle, ... }

//     // 1. Find user
//     let user = await User.findById(id);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     // 2. If user has no webcard, create one
//     let webcard;
//     if (!user.webcard_id) {
//       webcard = await Webcard.create({
//         about: { basicdetails: data },
//       });
//       user.webcard_id = webcard._id;
//       await user.save();
//     } else {
//       // Update existing
//       webcard = await Webcard.findByIdAndUpdate(
//         user.webcard_id,
//         { $set: { "about.basicdetails": data } },
//         { new: true }
//       );
//     }

//     if (!webcard) return res.status(404).json({ message: "Webcard not found" });

//     res.status(200).json(webcard.about.basicdetails);
//   } catch (err) {
//     console.error("CreateOrUpdate BasicDetails Error:", err.message);
//     res.status(500).json({ message: err.message });
//   }
// };

// // ---------------- GET basicdetails ----------------
// export const getBasicDetails = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const user = await User.findById(id);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     if (!user.webcard_id)
//       return res.status(404).json({ message: "User does not have a linked webcard" });

//     const webcard = await Webcard.findById(user.webcard_id);
//     if (!webcard) return res.status(404).json({ message: "Webcard not found" });

//     res.status(200).json(webcard.about.basicdetails || {});
//   } catch (err) {
//     console.error("Get BasicDetails Error:", err.message);
//     res.status(500).json({ message: err.message });
//   }
// };

// // ---------------- UPDATE existing basicdetails ----------------
// export const updateBasicDetails = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const data = req.body; // fields to update

//     const user = await User.findById(id);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     if (!user.webcard_id)
//       return res.status(404).json({ message: "User does not have a linked webcard" });

//     const webcard = await Webcard.findByIdAndUpdate(
//       user.webcard_id,
//       {
//         $set: Object.fromEntries(
//           Object.entries(data).map(([k, v]) => [`about.basicdetails.${k}`, v])
//         ),
//       },
//       { new: true }
//     );

//     if (!webcard) return res.status(404).json({ message: "Webcard not found" });

//     res.status(200).json(webcard.about.basicdetails);
//   } catch (err) {
//     console.error("Update BasicDetails Error:", err.message);
//     res.status(500).json({ message: err.message });
//   }
// };

// // ---------------- DELETE basicdetails ----------------
// export const deleteBasicDetails = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const user = await User.findById(id);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     if (!user.webcard_id)
//       return res.status(404).json({ message: "User does not have a linked webcard" });

//     const webcard = await Webcard.findByIdAndUpdate(
//       user.webcard_id,
//       { $unset: { "about.basicdetails": "" } },
//       { new: true }
//     );

//     if (!webcard) return res.status(404).json({ message: "Webcard not found" });

//     res.status(200).json({ message: "BasicDetails deleted successfully" });
//   } catch (err) {
//     console.error("Delete BasicDetails Error:", err.message);
//     res.status(500).json({ message: err.message });
//   }
// };



import Webcard from "../models/CardDesigner.js";
import User from "../models/User.js";

// ---------------- CREATE / UPDATE basicdetails ----------------
export const createOrUpdateBasicDetails = async (req, res) => {
  try {
    const id = await User.findById(req.userId);
    const data = req.body;     // { name, email, mobilenumber, jobTitle, ... }

    // 1. Find user
    let user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    let webcard;

    // 2. If user has no webcard, create one
    if (!user.webcard_id) {
      webcard = await Webcard.create({
        about: { basicdetails: data },
      });
      user.webcard_id = webcard._id;
      await user.save();
    } else {
      // 3. Try updating existing webcard
      webcard = await Webcard.findByIdAndUpdate(
        user.webcard_id,
        { $set: { "about.basicdetails": data } },
        { new: true }
      );

      // 4. If webcard id exists in user but not found in DB, recreate it
      if (!webcard) {
        webcard = await Webcard.create({
          about: { basicdetails: data },
        });
        user.webcard_id = webcard._id;
        await user.save();
      }
    }

    res.status(200).json(webcard.about.basicdetails);
  } catch (err) {
    console.error("CreateOrUpdate BasicDetails Error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// ---------------- GET basicdetails ----------------
export const getBasicDetails = async (req, res) => {
  try {
    const id = await User.findById(req.userId);

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.webcard_id)
      return res.status(404).json({ message: "User does not have a linked webcard" });

    let webcard = await Webcard.findById(user.webcard_id);

    // If webcard missing but user has id, auto-create blank one
    if (!webcard) {
      webcard = await Webcard.create({
        about: { basicdetails: {} },
      });
      user.webcard_id = webcard._id;
      await user.save();
    }

    res.status(200).json(webcard.about.basicdetails || {});
  } catch (err) {
    console.error("Get BasicDetails Error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// ---------------- UPDATE existing basicdetails ----------------
export const updateBasicDetails = async (req, res) => {
  try {
    const id = await User.findById(req.userId);
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

// ---------------- DELETE basicdetails ----------------
export const deleteBasicDetails = async (req, res) => {
  try {
    const id = await User.findById(req.userId);

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.webcard_id)
      return res.status(404).json({ message: "User does not have a linked webcard" });

    let webcard = await Webcard.findByIdAndUpdate(
      user.webcard_id,
      { $unset: { "about.basicdetails": "" } },
      { new: true }
    );

    // If webcard missing, silently re-create empty one
    if (!webcard) {
      webcard = await Webcard.create({
        about: { basicdetails: {} },
      });
      user.webcard_id = webcard._id;
      await user.save();
    }

    res.status(200).json({ message: "BasicDetails deleted successfully" });
  } catch (err) {
    console.error("Delete BasicDetails Error:", err.message);
    res.status(500).json({ message: err.message });
  }
};
