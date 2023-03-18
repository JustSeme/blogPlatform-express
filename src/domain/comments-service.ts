import { JwtService } from "../application/jwtService";
import { CommentDBModel, LikeObjectType } from "../models/comments/CommentDBModel";
import { LikeType } from "../models/comments/LikeInputModel";
import { UserDBModel } from "../models/users/UserDBModel";
import { CommentsRepository } from "../repositories/comments-db-repository";

export class CommentsService {
    private commentsRepository: CommentsRepository
    private jwtService: JwtService

    constructor() {
        this.commentsRepository = new CommentsRepository()
        this.jwtService = new JwtService()
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

    async updateLike(accessToken: string, commentId: string, status: LikeType) {
        const updatingComment = await this.commentsRepository.getCommentById(commentId)
        if (!updatingComment) {
            return false
        }

        const jwtResult = await this.jwtService.verifyRefreshToken(accessToken)
        console.log('jwtresult', jwtResult);

        if (!jwtResult) return false

        const userId = jwtResult.userId

        const likeData: LikeObjectType = {
            userId,
            createdAt: new Date().toISOString()
        }

        if (status === 'Like') {
            const likesArray = updatingComment.likesInfo.likes

            const isAlreadyLiked = likesArray!.findIndex((like) => like.userId === userId) > 0
            if (isAlreadyLiked) return false

            return this.commentsRepository.setLike(likeData, commentId)
        }

        if (status === 'Dislike') {
            const dislikesArray = updatingComment.likesInfo.dislikes

            const isAlreadyDisliked = dislikesArray!.findIndex((dislike) => dislike.userId === userId) > 0
            if (isAlreadyDisliked) return false

            return this.commentsRepository.setDislike(likeData, commentId)
        }

        return this.commentsRepository.setNoneLike(userId, commentId)
    }
}