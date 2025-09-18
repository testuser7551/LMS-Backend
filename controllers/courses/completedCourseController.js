import CompletedCourse from "../../models/courses/CompletedCourse.js";
import Course from "../../models/courses/Course.js";
import User from "../../models/User.js";

// Mark course as completed with certificate upload
export const markCourseCompleted = async (req, res) => {
    try {
        const { userId, courseId } = req.body;
        // console.log(userId,courseId);
        // Validate user and course
        const user = await User.findById(userId);
        const course = await Course.findById(courseId);

        if (!user || !course) {
            return res.status(404).json({ success: false, message: "User or course not found" });
        }

        // Handle uploaded file (certificate)
        let certificatePath = "";
        if (req.file) {
            certificatePath = `/uploads/completed/${req.file.filename}`; // Store relative path
        }

        // Check if already completed
        let completedCourse = await CompletedCourse.findOne({ user: userId, course: courseId });

        if (completedCourse) {
            completedCourse.courseCompleted = true;
            if (certificatePath) completedCourse.certificate = certificatePath;
        } else {
            completedCourse = new CompletedCourse({
                user: userId,
                course: courseId,
                courseCompleted: true,
                certificate: certificatePath
            });
        }
        // console.log(completedCourse);
        await completedCourse.save();

        res.status(200).json({
            success: true,
            message: "Course marked as completed with certificate",
            completedCourse
        });
    } catch (error) {
        console.error("Error in marking course completed:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};



// Get completed courses for a user
export const getCompletedCourses = async (req, res) => {
    try {
        const { userId } = req.params;

        const completedCourses = await CompletedCourse.find({ user: userId })
            .populate("course")
            .exec();

        res.status(200).json({ success: true, completedCourses });
    } catch (error) {
        console.error("Error fetching completed courses:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Get certificate for a completed course
export const getCertificate = async (req, res) => {
    try {
        const { userId, courseId } = req.params;

        const completedCourse = await CompletedCourse.findOne({ user: userId, course: courseId });

        if (!completedCourse || !completedCourse.courseCompleted) {
            return res.status(404).json({ success: false, message: "Course not completed or not found" });
        }

        res.status(200).json({ success: true, certificate: completedCourse.certificate });
    } catch (error) {
        console.error("Error fetching certificate:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
  };
