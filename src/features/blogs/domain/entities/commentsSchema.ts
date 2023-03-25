import mongoose from "mongoose";
import { CommentDBModel } from "./CommentDBModel";

export const commentsSchema = new mongoose.Schema<CommentDBModel>({
    id: { type: String, required: true },
    content: { type: String, required: true, min: 20, max: 300 },
    commentatorInfo: {
        userId: { type: String, required: true },
        userLogin: { type: String, required: true },
    },
    createdAt: { type: String, required: true },
    postId: { type: String, required: true },
    likesInfo: {
        likes: [
            { userId: String, createdAt: String }
        ],
        dislikes: [
            { userId: String, createdAt: String }
        ]
    }
})