import { CommentDBModel } from "../models/comments/CommentDBModel";
import { commentsModel } from "./db";

export const commentsRepository = {
    async createComment(createdComment: CommentDBModel) {
        await commentsModel.create(createdComment)
    },

    async deleteComment(commentId: string) {
        const result = await commentsModel.deleteOne({ id: commentId })
        return result.deletedCount === 1
    },

    async updateComment(commentId: string, content: string) {
        const result = await commentsModel.updateOne({ id: commentId }, { content: content })
        return result.matchedCount === 1
    }
}