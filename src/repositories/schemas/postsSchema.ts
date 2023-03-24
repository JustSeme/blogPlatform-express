import mongoose from "mongoose";
import { PostDBModel } from "../../models/posts/PostDBModel";

export const postsSchema = new mongoose.Schema<PostDBModel>({
    id: { type: String, required: true },
    title: { type: String, required: true, min: 3, max: 30 },
    shortDescription: { type: String, required: true, min: 3, max: 100 },
    content: { type: String, required: true, min: 3, max: 1000 },
    blogId: { type: String, required: true },
    blogName: { type: String, required: true },
    createdAt: { type: String, required: true },
    extendedLikesInfo: {
        likes: [{
            userId: String,
            createdAt: String
        }],
        dislikes: [{
            userId: String,
            createdAt: String
        }],
        noneEntities: [{
            userId: String,
            createdAt: String
        }]
    }
})