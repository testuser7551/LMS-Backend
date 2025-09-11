import mongoose from "mongoose";

const LessonProgressSchema = new mongoose.Schema({
    lessonId: { type: mongoose.Schema.Types.ObjectId, required: true },
    lectureType: { type: String, enum: ["Video", "Audio", "PDF", "Text", "Quiz"], required: true },
    completed: { type: Boolean, default: false },
    quizAnswers: [{ questionId: String, answer: String }], // Only for Quiz lessons
});

const ChapterProgressSchema = new mongoose.Schema({
    chapterId: { type: mongoose.Schema.Types.ObjectId, required: true },
    completed: { type: Boolean, default: false },
    lessons: [LessonProgressSchema],
});

const CourseProgressSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    chapters: [ChapterProgressSchema],
    courseCompleted: { type: Boolean, default: false },
}, { timestamps: true });

CourseProgressSchema.index({ user: 1, course: 1 }, { unique: true });

export default mongoose.model("CourseProgress", CourseProgressSchema);
