import mongoose from "mongoose";
import { PostViewModel } from "../../models/posts/PostViewModel";

export const postsSchema = new mongoose.Schema<PostViewModel>({
    id: { type: String, required: true },
    title: { type: String, required: true, min: 3, max: 30 },
    shortDescription: { type: String, required: true, min: 3, max: 100 },
    content: { type: String, required: true, min: 3, max: 1000 },
    blogId: { type: String, required: true },
    blogName: { type: String, required: true },
    createdAt: { type: String, required: true },
    likesInfo: {
        likesCount: Number,
        dislikesCount: Number
    }
})