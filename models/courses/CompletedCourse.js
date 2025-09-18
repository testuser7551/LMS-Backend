import mongoose from "mongoose";

const CompletedCourseSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        courseCompleted: {
            type: Boolean,
            default: false,
        },
        certificate: {
            type: String, // URL or file path of the certificate
            default: "",
        },
    },
    { timestamps: true }
);

export default mongoose.model("CompletedCourse", CompletedCourseSchema);
