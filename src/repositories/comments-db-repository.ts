import { CommentDBModel } from "../models/comments/CommentDBModel";
import { CommentsModel } from "./db";

export const commentsRepository = {
    async createComment(createdComment: CommentDBModel) {
        await CommentsModel.create(createdComment)
    },

    async deleteComment(commentId: string) {
        const result = await CommentsModel.deleteOne({ id: commentId })
        return result.deletedCount === 1
    },

    async updateComment(commentId: string, content: string) {
        const result = await CommentsModel.updateOne({ id: commentId }, { content: content })
        return result.matchedCount === 1
    }
}