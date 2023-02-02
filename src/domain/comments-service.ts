import { randomUUID } from "crypto";
import { CommentViewModel } from "../models/comments/CommentViewModel";
import { UserDBModel } from "../models/users/UserDBModel";
import { commentsRepository } from "../repositories/comments-db-repository";

export const commentsService = {
    async createComment(content: string, commentator: UserDBModel) {
        const createdComment: CommentViewModel = {
            id: randomUUID(),
            content,
            commentatorInfo: {
                userId: commentator.id,
                userLogin: commentator.login
            },
            createdAt: new Date().toISOString()
        }

        await commentsRepository.createComment(createdComment)

        return createdComment
    }
}