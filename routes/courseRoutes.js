import express from "express";
import {
    saveCourseDetails,
    saveChapter,
    saveLesson,
    saveFullCourse,
    getAllCourses,
    getCourseById,
    deleteCourse,
} from "../controllers/courseController.js";
import upload from "../middleware/upload.js";


const router = express.Router();


router.post("/", upload.single("image"), saveCourseDetails);

router.post("/full", saveFullCourse);

router.post("/:courseId/chapter", saveChapter);

router.post("/:courseId/chapter/:chapterId/lesson", upload.single("file"), saveLesson);

router.get("/", getAllCourses);
router.get("/:id", getCourseById);

router.delete("/:courseId", deleteCourse);


export default router;
