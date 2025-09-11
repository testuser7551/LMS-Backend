import mongoose from "mongoose";

//
// Student Quiz Schema
//
const StudentQuizSchema = new mongoose.Schema(
  {
    quiz_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QuizQuestion", // Reference QuizQuestionSchema inside Lesson
      required: true,
    },
    progress: {
      type: String,
      enum: ["completed", "incompleted"],
      default: "incompleted",
    },
    status: {
      type: String,
      enum: ["correct", "incorrect"],
      default: "incorrect",
    },
    answered: {
      type: Map,
      of: Number, // 0 -> not clicked, 1 -> clicked
      default: {}, // Example: { true: 1, false: 0 }
    },
  },
  { timestamps: true }
);

//
// Student Course Track Schema
//
const StudentCourseTrackSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User model
      required: true,
    },
    course_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course", // Reference Course
      required: true,
    },
    chapter_id: {
      type: mongoose.Schema.Types.ObjectId,
      // Refers to Chapter inside Course
    },
    lesson_id: {
      type: mongoose.Schema.Types.ObjectId,
      // Refers to Lesson inside Chapter
    },
    student_quiz_ids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "StudentQuiz", // Array of StudentQuiz documents
      },
    ],
    progress: {
      type: String,
      enum: ["completed", "incompleted"],
      default: "incompleted",
    },
    status: {
      type: String,
      enum: ["correct", "incorrect"],
      default: "incorrect",
    },
  },
  { timestamps: true }
);

//
// Register Models
//
export const StudentQuiz = mongoose.model("StudentQuiz", StudentQuizSchema);
export const StudentCourseTrack = mongoose.model(
  "StudentCourseTrack",
  StudentCourseTrackSchema
);
