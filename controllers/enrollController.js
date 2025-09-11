import Enrollment from "../models/EnrollModel.js";
import User from "../models/User.js";
import Course from "../models/Course.js";

// Enroll user in a course
export const enrollUser = async (req, res) => {
    const { userId, courseId } = req.body;
    try {
        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        // Check if user is already enrolled in this specific course
        const existing = await Enrollment.findOne({ user: userId, course: courseId });
        if (existing) {
            return res.status(400).json({ error: "User is already enrolled in this course" });
        }

        // Create enrollment
        const enrollment = new Enrollment({
            user: userId,
            course: courseId
        });

        await enrollment.save();

        res.status(200).json({ message: "User enrolled successfully", enrollment });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Get user’s enrollment
// Get all enrolled courses for a user
export const getEnrollments = async (req, res) => {
    const { userId } = req.params; // or from req.user if using auth middleware

    try {
        const enrollments = await Enrollment.find({ user: userId })
            .populate("course"); // Populating course details

        res.status(200).json({ enrollments });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

