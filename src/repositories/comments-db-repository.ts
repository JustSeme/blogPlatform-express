import { CommentViewModel } from "../models/comments/CommentViewModel";
import { commentsCollection } from "./db";

export const commentsRepository = {
    async createComment(createdComment: CommentViewModel) {
        await commentsCollection.insertOne(createdComment)
    }
}