import express from "express";
import { initCourseProgress, markLessonComplete, submitQuiz, checkAndMarkCourseComplete, getAllCourseProgress, deleteCourseProgress, getLessonProgress } from "../controllers/progressController.js";

const router = express.Router();

router.post("/init", initCourseProgress);
router.post("/lesson-complete", markLessonComplete);
router.post("/quiz-submit", submitQuiz);
router.post("/check-complete", checkAndMarkCourseComplete);
router.get("/", getAllCourseProgress);
router.delete("/:userId/:courseId", deleteCourseProgress);

router.get("/lesson-progress", getLessonProgress);
export default router;
