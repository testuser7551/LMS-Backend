import express from "express";

import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} from "../controllers/courses/categoryController.js";

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
    publishFullCourse,
    getEnrolledCourseCount,
} from "../controllers/courses/courseController.js";


import { enrollUser, getEnrollments, getAllEnroll, deleteEnrollment } from "../controllers/courses/enrollController.js";

import { initCourseProgress, markLessonComplete, submitQuiz, checkAndMarkCourseComplete, getAllCourseProgress, deleteCourseProgress, getLessonProgress } from "../controllers/courses/progressController.js";

import { markCourseCompleted, getCompletedCourses, getCertificate } from "../controllers/courses/completedCourseController.js";


import upload from "../middleware/upload.js";
import upload2 from "../middleware/courseCompleted.js";

const router = express.Router();

import { authorizeRoles } from "../middleware/roleMiddleWare.js";


router.get("/categories/", getCategories);
router.post("/categories/", authorizeRoles("admin"), createCategory);
router.put("/categories/:id", authorizeRoles("admin"), updateCategory);
router.delete("/categories/:id", authorizeRoles("admin"), deleteCategory);




router.post("/enrollment/enroll", enrollUser);
router.get("/enrollment/:userId", getEnrollments);
router.get("/enrollment", getAllEnroll);
router.delete("/enrollment/:userId/:courseId", deleteEnrollment);





router.post("/progress/init", initCourseProgress);
router.post("/progress/lesson-complete", markLessonComplete);
router.post("/progress/quiz-submit", submitQuiz);
router.post("/progress/check-complete", checkAndMarkCourseComplete);
router.get("/progress", getAllCourseProgress);
router.delete("/progress/:userId/:courseId", deleteCourseProgress);
router.get("/progress/lesson-progress", getLessonProgress);



router.post("/completed", upload2.single("certificate"), markCourseCompleted);
router.get("/completed/user/:userId", getCompletedCourses);
router.get("/completed/certificate/:userId/:courseId", getCertificate);





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
router.put("/:courseId/publish", publishFullCourse);
router.get("/enrollcoursescount/:courseId", getEnrolledCourseCount);




export default router;
