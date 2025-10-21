import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
    {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true, index: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
        content: { type: String, required: true, trim: true, maxlength: 1000 },
        rating: { type: Number, required: true, min: 1, max: 5 },
    },
    { timestamps: true }
);

ReviewSchema.index({ productId: 1, userId: 1 }, { unique: true });

const Review = mongoose.model("Review", ReviewSchema);

export default Review; 