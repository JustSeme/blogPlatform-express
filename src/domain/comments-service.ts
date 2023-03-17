import { CommentDBModel } from "../models/comments/CommentDBModel";
import { UserDBModel } from "../models/users/UserDBModel";
import { CommentsRepository } from "../repositories/comments-db-repository";

export class CommentsService {
    private commentsRepository: CommentsRepository

    constructor() {
        this.commentsRepository = new CommentsRepository()
    }

    async createComment(content: string, commentator: UserDBModel | null, postId: string) {
        if (!commentator) {
            return null
        }

        const createdComment = new CommentDBModel(content, postId, commentator.id, commentator.login)

        await this.commentsRepository.createComment(createdComment)

        return {
            id: createdComment.id,
            content: createdComment.content,
            commentatorInfo: { ...createdComment.commentatorInfo },
            createdAt: createdComment.createdAt
        }
    }

    async deleteComment(commentId: string) {
        return await this.commentsRepository.deleteComment(commentId)
    }

    async updateComment(commentId: string, content: string) {
        return await this.commentsRepository.updateComment(commentId, content)
    }
}