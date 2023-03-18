import { CommentDBModel, LikeObjectType } from "../models/comments/CommentDBModel";
import { LikeType } from "../models/comments/LikeInputModel";
import { CommentsModel } from "./db";

export class CommentsRepository {
    async createComment(createdComment: CommentDBModel) {
        await CommentsModel.create(createdComment)
    }

    async deleteComment(commentId: string) {
        const result = await CommentsModel.deleteOne({ id: commentId })
        return result.deletedCount === 1
    }

    async updateComment(commentId: string, content: string) {
        const result = await CommentsModel.updateOne({ id: commentId }, { content: content })
        return result.matchedCount === 1
    }

    async getCommentById(commentId: string) {
        return CommentsModel.findOne({ id: commentId })
    }

    async setLike(likeData: LikeObjectType, commentId: string) {
        const likedComment = await CommentsModel.findOne({ id: commentId })
        if (!likedComment) return false

        likedComment.likesInfo.likes!.push(likeData)

        await likedComment.save()
        return true
    }

    async setDislike(likeData: LikeObjectType, commentId: string) {
        const dislikedComment = await CommentsModel.findOne({ id: commentId })
        if (!dislikedComment) return false

        dislikedComment.likesInfo.dislikes!.push(likeData)

        await dislikedComment.save()
        return true
    }

    async setNoneLike(userId: string, commentId: string) {
        const likedComment = await CommentsModel.findOne({ id: commentId })
        if (!likedComment) return false

        const likeIndex = likedComment.likesInfo.likes.findIndex((like) => like.userId === userId)
        if (likeIndex > 0) {
            likedComment.likesInfo.likes.splice(likeIndex, 1)

            likedComment.save()
            return true
        }

        const dislikeIndex = likedComment.likesInfo.dislikes.findIndex((dislike) => dislike.userId === userId)
        if (dislikeIndex > 0) {
            likedComment.likesInfo.likes.splice(dislikeIndex, 1)

            likedComment.save()
            return true
        }
    }
}