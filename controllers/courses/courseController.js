import Course from "../../models/courses/Course.js";
import path from "path";
import fs from "fs";
import Enrollment from "../../models/courses/EnrollModel.js";

// Save Course Details with Image Upload
export const saveCourseDetails = async (req, res) => {
    try {

        const { category, title, description, level, instructor, tags, chapters } = req.body;
        const tagsarray = JSON.parse(req.body.tags);
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
            tags: tagsarray,
            image,
            chapters: chaptersArray,
        });
        // console.log(course);
        await course.save();
        res.status(201).json({ success: true, course });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Update Course Details
export const updateCourseDetails = async (req, res) => {
    try {
        const { id } = req.params;


        const enrolledCount = await Enrollment.countDocuments({ course: id });
        console.log(`Enrolled students: ${enrolledCount}`);

        // If there are enrolled students, block update
        if (enrolledCount > 0) {
            return res.status(400).json({
                success: false,
                message: "Cannot update course because students are already enrolled."
            });
        }


        const { category, title, description, level, instructor, tags, chapters } = req.body;
        const tagsarray = JSON.parse(req.body.tags);

        const image = req.file ? req.file.filename : undefined; // undefined means don't update if no new file

        let chaptersArray = [];
        if (chapters) {
            try {
                chaptersArray = JSON.parse(chapters);
            } catch (error) {
                return res.status(400).json({ success: false, message: "Invalid chapters format" });
            }
        }

        const updateFields = {
            category,
            title,
            description,
            level,
            instructor,
            tags: tagsarray,
            chapters: chaptersArray,
        };

        if (image !== undefined) {
            updateFields.image = image;
        }

        const updatedCourse = await Course.findByIdAndUpdate(id, updateFields, { new: true });

        if (!updatedCourse) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        res.json({ success: true, course: updatedCourse });
    } catch (error) {
        // console.error("Error updating course:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Save Chapter Title
export const saveChapter = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { chapterTitle } = req.body;
        // console.log(chapterTitle, courseId);
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
export const updateChapterController = async (req, res) => {
    try {
        const { courseId, chapterId } = req.params;
        const { chapterTitle } = req.body;

        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ success: false, message: "Course not found" });

        const chapter = course.chapters.id(chapterId);
        if (!chapter) return res.status(404).json({ success: false, message: "Chapter not found" });

        chapter.chapterTitle = chapterTitle;
        await course.save();

        res.json({ success: true, chapter });
    } catch (error) {
        // console.error("Error updating chapter:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
export const deleteChapter = async (req, res) => {
    const { courseId, chapterId } = req.params;

    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        // Filter out the chapter to delete
        course.chapters = course.chapters.filter((chapter) => chapter._id.toString() !== chapterId);

        await course.save();
        await updateCourseStatus(courseId);

        res.status(200).json({ success: true, message: "Chapter deleted successfully" });
    } catch (error) {
        // console.error("Error deleting chapter:", error);
        res.status(500).json({ success: false, message: "Server error" });
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
        await updateCourseStatus(courseId);

        const newLesson = chapter.lessons[chapter.lessons.length - 1];
        res.status(201).json({ success: true, lesson: newLesson });
    } catch (error) {
        // console.error("Error in saveLesson:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export const updateLesson = async (req, res) => {
    try {
        const { courseId, chapterId, lessonId } = req.params;
        const updatedData = req.body; // { lessonName, lectureType, duration, published, etc. }
        // console.log(courseId, chapterId, lessonId, updatedData);
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ success: false, message: "Course not found" });

        // Find the chapter
        const chapter = course.chapters.id(chapterId);
        if (!chapter) return res.status(404).json({ success: false, message: "Chapter not found" });

        // Find the lesson
        const lesson = chapter.lessons.id(lessonId);
        if (!lesson) return res.status(404).json({ success: false, message: "Lesson not found" });

        // Update lesson fields
        Object.keys(updatedData).forEach(key => {
            lesson[key] = updatedData[key];
        });

        await course.save();
        await updateCourseStatus(courseId);

        res.json({ success: true, lesson });
    } catch (error) {
        // console.error("Error updating lesson:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
export const deleteLesson = async (req, res) => {
    try {
        const { courseId, chapterId, lessonId } = req.params;

        const course = await Course.findById(courseId);
        if (!course)
            return res.status(404).json({ success: false, message: "Course not found" });

        const chapter = course.chapters.id(chapterId);
        if (!chapter)
            return res.status(404).json({ success: false, message: "Chapter not found" });

        const lesson = chapter.lessons.id(lessonId);
        if (!lesson)
            return res
                .status(404)
                .json({ success: false, message: "Lesson not found" });
        // Remove the lesson using filter
        chapter.lessons = chapter.lessons.filter(
            (lesson) => lesson._id.toString() !== lessonId
        );

        await course.save();
        await updateCourseStatus(courseId);

        res.json({ success: true, message: "Lesson deleted successfully" });
    } catch (error) {
        // console.error("Error deleting lesson:", error);
        res.status(500).json({ success: false, message: "Server error" });
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
        // const courses = await Course.find();
        // When fetching courses
        const courses = await Course.find({ status: "Active" });
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
        // Instead of Course.deleteOne({_id: id})
        await Course.findByIdAndUpdate(courseId, { status: "Inactive" });


        // // 1. Delete course image if exists
        // if (course.image) {
        //     const imgPath = path.join(process.cwd(), "uploads", course.image);
        //     if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
        // }

        // // 2. Delete all lesson files (videos, PDFs, etc.)
        // course.chapters.forEach((chapter) => {
        //     chapter.lessons.forEach((lesson) => {
        //         // If lesson has a file uploaded
        //         if (lesson.file) {
        //             const filePath = path.join(process.cwd(), "uploads", lesson.file);
        //             if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        //         }
        //     });
        // });

        // // 3. Delete course from DB
        // await Course.findByIdAndDelete(courseId);

        // res.status(200).json({ success: true, message: "Course and all associated files deleted successfully" });
        res.status(200).json({ success: true, message: "Course Inactivated successfully" });
    } catch (error) {
        // console.error("Error deleting course:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};



export const publishFullCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        // Find the course by ID and populate its chapters and lessons
        const course = await Course.findById(courseId).populate({
            path: 'chapters',
            populate: {
                path: 'lessons'
            }
        });
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }
        // Log all lessons across all chapters
        const allLessons = course.chapters.flatMap(chapter => chapter.lessons);
        // Check if at least one lesson is published
        const hasPublishedLesson = course.chapters.some(chapter =>
            chapter.lessons.some(lesson => lesson.published === "Published")
        );
        if (!hasPublishedLesson) {
            return res.status(400).json({
                success: false,
                message: "Cannot publish course. At least one lesson must be published."
            });
        }
        // Update the coursepublished field
        course.coursepublished = "Published";
        // Save the course
        await course.save();
        res.status(200).json({ success: true, message: "Course published successfully", course });
    } catch (error) {
        // console.error("Error publishing course:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};


// A helper function that only updates, without sending a response
const updateCourseStatus = async (courseId) => {
    const course = await Course.findById(courseId).populate({
        path: 'chapters',
        populate: { path: 'lessons' }
    });
    if (!course) throw new Error("Course not found");
    // console.log("hi from update course sataus", course);
    if (!course.chapters || course.chapters.length === 0) {
        course.coursepublished = "Draft";
    } else {
        const allLessons = course.chapters.flatMap(ch => ch.lessons);
        if (allLessons.length === 0) {
            course.coursepublished = "Draft";
        } else {
            const hasPublishedLesson = allLessons.some(lesson => lesson.published === "Published");
            // Only publish if course is public AND has at least one published lesson
            if (course.coursepublished == "Published" && hasPublishedLesson) {
                course.coursepublished = "Published";
            } else {
                course.coursepublished = "Draft";
            }
        }
    }
    await course.save();
    // console.log(course);
};


export const getEnrolledCourseCount = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const enrolledCount = await Enrollment.countDocuments({ course: courseId });
        res.status(200).json({ success: true, enrolledCount });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
