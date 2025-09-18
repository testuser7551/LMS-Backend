import mongoose from "mongoose";

// Quiz Question Schema
const QuizQuestionSchema = new mongoose.Schema({
    type: { type: String, enum: ["Fill in the Blanks", "Multiple Choice", "True/False"], default: "Fill in the Blanks" },
    question: { type: String },
    answer: { type: String },
    options: [{ type: String }], // Only for Multiple Choice
    correctAnswer: { type: String },
});

// Text Section Schema
const TextSectionSchema = new mongoose.Schema({
    type: { type: String, enum: ["Normal", "Tab"], default: "Normal" },
    title: { type: String },
    description: { type: String },
    heading: { type: String },
    contents: [
        {
            contentTitle: { type: String },
            contentDescription: { type: String },
        },
    ],
});

// Duration Schema
const DurationSchema = new mongoose.Schema({
    value: { type: String }, // Storing as string since user input like '10' or '1' hrs
    unit: { type: String, enum: ["mins", "hrs"], default: "mins" },
});

// Lesson Schema
const LessonSchema = new mongoose.Schema({
    lessonName: { type: String },
    lessonDescription: { type: String },
    duration: DurationSchema,
    lectureType: { type: String, enum: ["Video", "Audio", "PDF", "Text", "Quiz"], default: "Video" },
    file: { type: mongoose.Schema.Types.Mixed }, // Can be file metadata or URL reference
    resourceURL: { type: String },
    quiz: [QuizQuestionSchema],
    sections: [TextSectionSchema],
    published: { type: String, enum: ["Draft", "Published"], default: "Draft" },
});

// Chapter Schema
const ChapterSchema = new mongoose.Schema({
    chapterTitle: { type: String },
    lessons: [LessonSchema],
});

// Course Schema
const CourseSchema = new mongoose.Schema(
    {
        category: { type: String },
        title: { type: String, required: true },
        description: { type: String },
        level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Beginner" },
        instructor: { type: String },
        tags: { type: [String], default: [] },
        image: { type: mongoose.Schema.Types.Mixed }, // File object or URL
        chapters: [ChapterSchema],
        coursepublished: { type: String, enum: ["Draft", "Published"], default: "Draft" },
        status: {
            type: String,
            enum: ["Active", "Inactive"],
            default: "Active",
        },
    },
    { timestamps: true }
);

export default mongoose.model("Course", CourseSchema);
