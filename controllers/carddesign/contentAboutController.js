import path from "path";
import fs from "fs";

import Webcard from "../../models/CardDesigner.js";
import User from "../../models/User.js";
import CompletedCourse from "../../models/courses/CompletedCourse.js";
import mongoose from "mongoose";

// 🔹 Common helper for fetching user + webcard
const getUserWithWebcard = async (userId) => {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");
    if (!user.webcard_id) throw new Error("User does not have a linked webcard");
    return user;
};

const isValidDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return true; // skip validation if missing

  const start = new Date(`${startDate.month} 1, ${startDate.year}`);
  const end = new Date(`${endDate.month} 1, ${endDate.year}`);

  return end >= start;
};



// ---------------- UPDATE existing Content Tabs ----------------

export const updateContentAbout = async (req, res) => {
    try {
        const id = await User.findById(req.user._id);
        const data = req.body;

        const user = await getUserWithWebcard(id);

        const updateFields = Object.fromEntries(
            Object.entries(data).map(([k, v]) => [`contentAbout.aboutMeSection.${k}`, v])
        );

        const webcard = await Webcard.findByIdAndUpdate(
            user.webcard_id,
            { $set: updateFields },
            { new: true }
        );

        if (!webcard) return res.status(404).json({ message: "Webcard not found" });

        res.status(200).json(webcard?.contentAbout?.aboutMeSection || {});
    } catch (err) {
        console.error("Update TextSection Error:", err.message);
        res.status(500).json({ message: err.message });
    }
};



export const saveExperienceSection = async (req, res) => {
  try {
    const id = await User.findById(req.user._id);
    const data = req.body; // from client

    let newExperiences = [];

    // If frontend sends single object → wrap in array
    if (data && !Array.isArray(data.experienceData) && data.title) {
      newExperiences = [data];
    } else if (Array.isArray(data.experienceData)) {
      newExperiences = data.experienceData;
    }

    // Validation: check all incoming experiences
    for (const exp of newExperiences) {
      if (
        !exp.currentlyWorking &&
        !isValidDateRange(exp.startDate, exp.endDate)
      ) {
        return res.status(400).json({
          success: false,
          message: `End date must be after start date for experience: ${
            exp.title || "Untitled"
          }`,
        });
      }
    }

    const user = await getUserWithWebcard(id);

    // Append instead of replace
    const webcard = await Webcard.findByIdAndUpdate(
      user.webcard_id,
      {
        $push: {
          "contentAbout.experienceSection.experienceData": {
            $each: newExperiences,
          },
        },
      },
      { new: true }
    );

    if (!webcard) {
      return res.status(404).json({ message: "Webcard not found" });
    }

    // Get only the last inserted experience
    const inserted =
      webcard.contentAbout.experienceSection.experienceData.slice(-1)[0];

    res.status(200).json({
      success: true,
      experience: inserted,
    });
  } catch (err) {
    console.error("Save ExperienceSection Error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};



export const updateExperienceMeta = async (req, res) => {
  try {
    const id = await User.findById(req.user._id);
    const { experienceTitle, isEnabled } = req.body;

    const user = await getUserWithWebcard(id);

    const updateFields = {};
    if (experienceTitle !== undefined) {
      updateFields["contentAbout.experienceSection.experienceTitle"] = experienceTitle;
    }
    if (isEnabled !== undefined) {
      updateFields["contentAbout.experienceSection.isEnabled"] = isEnabled;
    }

    const webcard = await Webcard.findByIdAndUpdate(
      user.webcard_id,
      { $set: updateFields },
      { new: true }
    );

    if (!webcard) return res.status(404).json({ message: "Webcard not found" });

    res.status(200).json({
      success: true,
      experienceSection: {
        experienceTitle: webcard.contentAbout.experienceSection.experienceTitle,
        isEnabled: webcard.contentAbout.experienceSection.isEnabled,
      },
    });
  } catch (err) {
    console.error("Update ExperienceMeta Error:", err.message);
    res.status(500).json({ message: err.message });
  }
};







//   export const updateExperienceById = async (req, res) => {
//     try {
//       const { experienceId } = req.params; // experience _id
//       const updates = req.body; // fields to update (title, company, etc.)
  
//       const id = await User.findById(req.user._id);
//       const user = await getUserWithWebcard(id);
  
//       const webcard = await Webcard.findByIdAndUpdate(
//         user.webcard_id,
//         {
//           $set: Object.fromEntries(
//             Object.entries(updates).map(([key, value]) => [
//               `contentAbout.experienceSection.experienceData.$[elem].${key}`,
//               value,
//             ])
//           ),
//         },
//         {
//           new: true,
//           arrayFilters: [{ "elem._id": experienceId }],
//         }
//       );
  
//       if (!webcard) {
//         return res.status(404).json({ message: "Webcard not found" });
//       }
  
//       res.status(200).json({
//         success: true,
//         message: "Experience updated successfully",
//         experienceSection: webcard.contentAbout.experienceSection,
//       });
//     } catch (err) {
//       console.error("Update Single Experience Error:", err.message);
//       res.status(500).json({ success: false, message: err.message });
//     }
// };


export const updateExperienceById = async (req, res) => {
  try {
    const { experienceId } = req.params; // experience _id
    const updates = req.body; // fields to update (title, company, etc.)

    const id = await User.findById(req.user._id);
    const user = await getUserWithWebcard(id);

    const webcard = await Webcard.findByIdAndUpdate(
      user.webcard_id,
      {
        $set: Object.fromEntries(
          Object.entries(updates).map(([key, value]) => [
            `contentAbout.experienceSection.experienceData.$[elem].${key}`,
            value,
          ])
        ),
      },
      {
        new: true,
        arrayFilters: [{ "elem._id": experienceId }],
      }
    );

    if (!webcard) {
      return res.status(404).json({ message: "Webcard not found" });
    }

    // Extract only the updated experience
    const updatedExp = webcard.contentAbout.experienceSection.experienceData.find(
      (exp) => exp._id.toString() === experienceId
    );

    if (!updatedExp) {
      return res
        .status(404)
        .json({ success: false, message: "Experience not found" });
    }

    res.status(200).json({
      success: true,
      message: "Experience updated successfully",
      experience: updatedExp,
    });
  } catch (err) {
    console.error("Update Single Experience Error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

  

export const deleteExperience = async (req, res) => {
    try {
      const { experienceId } = req.params; // ID of the experience item
  
      // safeguard: check if experienceId is provided
      if (!experienceId) {
        return res.status(400).json({
          success: false,
          message: "experienceId is required in request params",
        });
      }
  
      const id = await User.findById(req.user._id);
      const user = await getUserWithWebcard(id);
  
      const webcard = await Webcard.findByIdAndUpdate(
        user.webcard_id,
        {
          $pull: {
            "contentAbout.experienceSection.experienceData": { _id: experienceId },
          },
        },
        { new: true }
      );
  
      if (!webcard) {
        return res.status(404).json({ success: false, message: "Webcard not found" });
      }
  
      res.status(200).json({
        success: true,
        message: "Experience deleted successfully",
        experienceSection: webcard.contentAbout.experienceSection,
      });
    } catch (err) {
      console.error("Delete Experience Error:", err.message);
      res.status(500).json({ success: false, message: err.message });
    }
};


export const isEnabledContent = async (req, res) => {
    try {
        const id = await User.findById(req.user._id);
        const { contentpage, isEnabled } = req.body; 
        if (!contentpage || typeof isEnabled !== "boolean") {
            return res.status(400).json({ message: "contentpage and isEnabled are required" });
          }

        const user = await getUserWithWebcard(id);
        const updatePath = `${contentpage}.isEnabled`;
        const webcard = await Webcard.findByIdAndUpdate(
            user.webcard_id,
            { $set: { [updatePath]: isEnabled } },
            { new: true }
        );

        if (!webcard) return res.status(404).json({ message: "Webcard not found" });

        res.status(200).json(
            {
            message: `${contentpage} updated successfully`,
            isEnabled: `${webcard}.${contentpage}?.isEnabled`
            });
    } catch (err) {
        console.error("Update TextSection Error:", err.message);
        res.status(500).json({ message: err.message });
    }
};


export const getCertificates = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    
    if (!userId) throw new Error("User not found");

    const certificates = await CompletedCourse.find({ user: userId })
      .select("_id certificate") // only these fields from CompletedCourse
      .populate("course", "title");

    res.status(200).json({
      message: "Certificates fetched successfully",
      certificates,
    });
  } catch (err) {
    console.error("Get Certificates Error:", err.message);
    res.status(500).json({ message: err.message });
  }
};


export const updateCourseCertificates = async (req, res) => {
  try {
    const id = await User.findById(req.user._id);
    const { coursecertificates } = req.body;

    if (!Array.isArray(coursecertificates)) {
      return res.status(400).json({
        success: false,
        message: "coursecertificates must be an array of IDs",
      });
    }

    // ✅ Validate and keep only ObjectIds
    const validIds = coursecertificates.filter((cid) =>
      mongoose.Types.ObjectId.isValid(cid)
    );

    if (validIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid course certificate IDs provided",
      });
    }

    const user = await getUserWithWebcard(id);

    // ✅ Use $addToSet + $each (prevents duplicates, appends new ones only)
    const webcard = await Webcard.findByIdAndUpdate(
      user.webcard_id,
      {
        $addToSet: { "certification.coursecertificates": { $each: validIds } },
      },
      { new: true }
    ).populate("certification.coursecertificates");

    if (!webcard) {
      return res
        .status(404)
        .json({ success: false, message: "Webcard not found" });
    }

    res.status(200).json({
      success: true,
      message: "Course certificates appended successfully",
      coursecertificates: webcard.certification.coursecertificates,
    });
  } catch (err) {
    console.error("Update CourseCertificates Error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

