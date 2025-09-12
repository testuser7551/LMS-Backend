import CourseProgress from "../models/CourseProgress.js";

// Initialize course progress on enrollment
export const initCourseProgress = async (req, res) => {
    try {
        const { userId, course } = req.body;

        const progressExists = await CourseProgress.findOne({ user: userId, course });
        if (progressExists) return res.status(400).json({ message: "Already exists" });

        const chapters = course.chapters.map(ch => ({
            chapterId: ch._id,
            completed: false,
            lessons: ch.lessons.map(ls => ({
                lessonId: ls._id,
                lectureType: ls.lectureType,
                completed: false,
            })),
        }));

        const courseProgress = new CourseProgress({ user: userId, course: course._id, chapters });
        await courseProgress.save();
        res.json(courseProgress);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// Mark lesson complete (video/pdf/audio/text)
export const markLessonComplete = async (req, res) => {
    try {
        const { userId, courseId, chapterId, lessonId } = req.body;
        // console.log(userId, courseId, chapterId, lessonId);
        const progress = await CourseProgress.findOne({ user: userId, course: courseId });
        if (!progress) return res.status(404).json({ message: "Progress not found" });

        const chapter = progress.chapters.find(c => c.chapterId.toString() === chapterId);
        if (!chapter) return res.status(404).json({ message: "Chapter not found" });

        const lesson = chapter.lessons.find(l => l.lessonId.toString() === lessonId);
        if (!lesson) return res.status(404).json({ message: "Lesson not found" });

        lesson.completed = true;

        // Check if chapter is completed
        chapter.completed = chapter.lessons.every(l => l.completed);

        // Check if course is completed
        progress.courseCompleted = progress.chapters.every(c => c.completed);

        await progress.save();
        res.json({ message: "Lesson marked complete", progress });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// Submit quiz
export const submitQuiz = async (req, res) => {
    try {
        const { userId, courseId, chapterId, lessonId, answers } = req.body;
        console.log(userId, courseId, chapterId, lessonId, answers);
        const progress = await CourseProgress.findOne({ user: userId, course: courseId });
        if (!progress) return res.status(404).json({ message: "Progress not found" });

        const chapter = progress.chapters.find(c => c.chapterId.toString() === chapterId);
        if (!chapter) return res.status(404).json({ message: "Chapter not found" });

        const lesson = chapter.lessons.find(l => l.lessonId.toString() === lessonId);
        if (!lesson) return res.status(404).json({ message: "Lesson not found" });

        lesson.quizAnswers = answers;
        lesson.completed = true;

        chapter.completed = chapter.lessons.every(l => l.completed);
        progress.courseCompleted = progress.chapters.every(c => c.completed);

        await progress.save();
        res.json({ message: "Quiz submitted and lesson completed", progress });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// controllers/courseProgressController.js

// controllers/courseProgressController.js

export const checkAndMarkCourseComplete = async (req, res) => {
    try {
        const { userId, courseId } = req.body;

        if (!userId || !courseId) {
            return res.status(400).json({ message: "userId and courseId are required" });
        }

        // Fetch the course progress from the database
        const courseProgress = await CourseProgress.findOne({ user: userId, course: courseId });

        if (!courseProgress) {
            return res.status(404).json({ message: "Course progress not found" });
        }

        // Check if all lessons in all chapters are completed
        const allLessonsCompleted = courseProgress.chapters.every(chapter =>
            chapter.lessons.every(lesson => lesson.completed)
        );

        if (allLessonsCompleted && !courseProgress.courseCompleted) {
            courseProgress.courseCompleted = true;
            await courseProgress.save();
            return res.json({
                message: "All lessons completed! Course marked as completed.",
                courseCompleted: true
            });
        }

        return res.json({
            message: allLessonsCompleted ? "All lessons are completed." : "There are incomplete lessons.",
            courseCompleted: courseProgress.courseCompleted
        });

    } catch (error) {
        console.error("Error in checkAndMarkCourseComplete:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};



// Get all course progress
export const getAllCourseProgress = async (req, res) => {
    try {
        const progressList = await CourseProgress.find()
            .populate("user", "name email")      // optional, for better data display
            .populate("course", "title description");

        res.status(200).json(progressList);
    } catch (error) {
        console.error("Error fetching course progress:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Delete a particular course progress
export const deleteCourseProgress = async (req, res) => {
    try {
        const { userId, courseId } = req.params;

        const progress = await CourseProgress.findOneAndDelete({
            user: userId,
            course: courseId
        });

        if (!progress) {
            return res.status(404).json({ message: "Course progress not found" });
        }

        res.status(200).json({ message: "Course progress deleted successfully" });
    } catch (error) {
        console.error("Error deleting course progress:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};