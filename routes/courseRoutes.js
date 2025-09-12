import express from "express";
import {
    saveCourseDetails,
    saveChapter,
    saveLesson,
    saveFullCourse,
    getAllCourses,
    getCourseById,
    deleteCourse,
    updateCourseDetails,
    updateChapterController,
    deleteChapter,
    updateLesson,
    deleteLesson,
} from "../controllers/courseController.js";
import upload from "../middleware/upload.js";
const router = express.Router();

router.post("/", upload.single("image"), saveCourseDetails);
router.put("/:id", upload.single("image"), updateCourseDetails);
router.post("/full", saveFullCourse);
router.post("/:courseId/chapter", saveChapter);
router.post("/:courseId/chapter/:chapterId/lesson", upload.single("file"), saveLesson);
router.get("/", getAllCourses);
router.get("/:id", getCourseById);
router.delete("/:courseId", deleteCourse);

router.put("/:courseId/chapter/:chapterId", updateChapterController);
router.delete("/:courseId/chapters/:chapterId", deleteChapter);
router.put("/:courseId/chapters/:chapterId/lessons/:lessonId", updateLesson);
router.delete("/:courseId/chapters/:chapterId/lessons/:lessonId", deleteLesson);
export default router;
