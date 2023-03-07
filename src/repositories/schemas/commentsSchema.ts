import mongoose from "mongoose";
import { CommentDBModel } from "../../models/comments/CommentDBModel";

export const commentsSchema = new mongoose.Schema<CommentDBModel>({
    id: { type: String, required: true },
    content: { type: String, required: true },
    commentatorInfo: {
        userId: { type: String, required: true },
        userLogin: { type: String, required: true },
    },
    createdAt: { type: String, required: true },
    postId: { type: String, required: true },
})