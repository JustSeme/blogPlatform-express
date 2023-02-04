import { CommentDBModel } from "../models/comments/CommentDBModel";
import { commentsCollection } from "./db";

export const commentsRepository = {
    async createComment(createdComment: CommentDBModel) {
        await commentsCollection.insertOne(createdComment)
    },

    async deleteComment(commentId: string) {
        const result = await commentsCollection.deleteOne({id: commentId})
        return result.deletedCount === 1
    }
}