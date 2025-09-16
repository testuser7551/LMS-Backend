import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        categoryName: { type: String, required: true, unique: true },
        createdByName: { type: String, required: true },
        createdByRole: { type: String, required: true },
        updatedByName: { type: String },
        updatedByRole: { type: String },
    },
    { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
