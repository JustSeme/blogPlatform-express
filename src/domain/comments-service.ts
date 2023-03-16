import { CommentDBModel } from "../models/comments/CommentDBModel";
import { UserDBModel } from "../models/users/UserDBModel";
import { commentsRepository } from "../repositories/comments-db-repository";

class CommentsService {
    async createComment(content: string, commentator: UserDBModel | null, postId: string) {
        if (!commentator) {
            return null
        }

        const createdComment = new CommentDBModel(content, postId, commentator.id, commentator.login)

        await commentsRepository.createComment(createdComment)

        return {
            id: createdComment.id,
            content: createdComment.content,
            commentatorInfo: { ...createdComment.commentatorInfo },
            createdAt: createdComment.createdAt
        }
    }

    async deleteComment(commentId: string) {
        return await commentsRepository.deleteComment(commentId)
    }

    async updateComment(commentId: string, content: string) {
        return await commentsRepository.updateComment(commentId, content)
    }
}

export const commentsService = new CommentsService()