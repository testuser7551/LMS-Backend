import Course from "../models/Course.js";
import path from "path";
import fs from "fs";

// Save Course Details with Image Upload
export const saveCourseDetails = async (req, res) => {
    try {
        const { category, title, description, level, instructor, chapters } = req.body;
        // Handle uploaded file
        const image = req.file ? req.file.filename : null;
        // Parse chapters if it's sent as a JSON string
        let chaptersArray = [];
        if (chapters) {
            try {
                chaptersArray = JSON.parse(chapters);
            } catch (error) {
                return res.status(400).json({ success: false, message: "Invalid chapters format" });
            }
        }
        const course = new Course({
            category,
            title,
            description,
            level,
            instructor,
            image,
            chapters: chaptersArray,
        });
        console.log(course);
        await course.save();
        res.status(201).json({ success: true, course });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


// Save Chapter Title
export const saveChapter = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { chapterTitle } = req.body;
        console.log(chapterTitle, courseId);
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }
        course.chapters.push({ chapterTitle, lessons: [] });
        await course.save();
        res.status(201).json({ success: true, chapter: course.chapters[course.chapters.length - 1] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Save Lesson
export const saveLesson = async (req, res) => {
    try {
        const { courseId, chapterId } = req.params;
        const lessonData = req.body;
        // Parse duration if it's a string
        if (lessonData.duration && typeof lessonData.duration === "string") {
            lessonData.duration = JSON.parse(lessonData.duration);
        }
        // Parse quiz if it's a string
        if (lessonData.quiz && typeof lessonData.quiz === "string") {
            lessonData.quiz = JSON.parse(lessonData.quiz);
        }
        // Parse sections if it's a string
        if (lessonData.sections && typeof lessonData.sections === "string") {
            lessonData.sections = JSON.parse(lessonData.sections);
        }
        // Attach uploaded file name to lessonData
        if (req.file) {
            lessonData.file = req.file.filename;
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        const chapter = course.chapters.id(chapterId);
        if (!chapter) {
            return res.status(404).json({ success: false, message: "Chapter not found" });
        }

        chapter.lessons.push(lessonData);
        await course.save();

        const newLesson = chapter.lessons[chapter.lessons.length - 1];
        res.status(201).json({ success: true, lesson: newLesson }); 
    } catch (error) {
        console.error("Error in saveLesson:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};


// Save Entire Course
export const saveFullCourse = async (req, res) => {
    try {
        const courseData = req.body;
        const course = new Course(courseData);
        await course.save();
        res.status(201).json({ success: true, course });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};



// Get all courses
export const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json({ success: true, courses });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getCourseById = async (req, res) => {
    try {
        const { id } = req.params; // get course ID from the URL
        const course = await Course.findById(id);

        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        res.status(200).json({ success: true, course });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


// Delete a course by ID and associated files
export const deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        // Find the course first
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        // 1. Delete course image if exists
        if (course.image) {
            const imgPath = path.join(process.cwd(), "uploads", course.image);
            if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
        }

        // 2. Delete all lesson files (videos, PDFs, etc.)
        course.chapters.forEach((chapter) => {
            chapter.lessons.forEach((lesson) => {
                // If lesson has a file uploaded
                if (lesson.file) {
                    const filePath = path.join(process.cwd(), "uploads", lesson.file);
                    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                }
            });
        });

        // 3. Delete course from DB
        await Course.findByIdAndDelete(courseId);

        res.status(200).json({ success: true, message: "Course and all associated files deleted successfully" });
    } catch (error) {
        console.error("Error deleting course:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};
