import { randomUUID } from "crypto";
import { CommentDBModel } from "../models/comments/CommentDBModel";
import { UserDBModel } from "../models/users/UserDBModel";
import { commentsRepository } from "../repositories/comments-db-repository";

export const commentsService = {
    async createComment(content: string, commentator: UserDBModel, postId: string) {
        const createdComment: CommentDBModel = {
            id: randomUUID(),
            content,
            commentatorInfo: {
                userId: commentator.id,
                userLogin: commentator.login
            },
            createdAt: new Date().toISOString(),
            postId
        }

        await commentsRepository.createComment(createdComment)

        return {
            id: createdComment.id,
            content: createdComment.content,
            commentatorInfo: {...createdComment.commentatorInfo},
            createdAt: createdComment.createdAt
        }
    },

    async deleteComment(commentId: string) {
        return await commentsRepository.deleteComment(commentId)
    },

    async updateComment(commentId: string, content: string) {
        return await commentsRepository.updateComment(commentId, content)
    }
}