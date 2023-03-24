import { PostInputModel } from '../models/posts/PostInputModel'
import { PostDBModel } from '../models/posts/PostDBModel'
import { PostsModel } from './db'
import { injectable } from 'inversify/lib/annotation/injectable';
import { LikeObjectType } from '../models/comments/CommentDBModel';
import { Document } from 'mongoose';

@injectable()
export class PostsRepository {
    async deletePosts(id: string) {
        let result = await PostsModel.deleteOne({ id: id })
        return result.deletedCount === 1
    }

    async createPost(createdPost: PostDBModel) {
        await PostsModel.create(createdPost)
    }

    async updatePost(id: string, body: PostInputModel) {
        const result = await PostsModel.updateOne({ id: id }, { $set: { content: body.content, title: body.title, shortDescription: body.shortDescription, blogId: body.blogId } })
        return result.matchedCount === 1
    }

    async getPostById(id: string) {
        return PostsModel.findOne({ id })
    }

    async createLike(likeData: LikeObjectType, postId: string) {
        const likedPost = await PostsModel.findOne({ id: postId })
        if (!likedPost) return false

        likedPost.extendedLikesInfo.likes.push(likeData)

        await likedPost.save()
        return true
    }

    async createDislike(likeData: LikeObjectType, postId: string) {
        const dislikedPost = await PostsModel.findOne({ id: postId })
        if (!dislikedPost) return false

        dislikedPost.extendedLikesInfo.dislikes.push(likeData)

        await dislikedPost.save()
        return true
    }

    async setNone(editablePost: Document<unknown, {}, PostDBModel> & Omit<PostDBModel, never>, likeIndex: number, dislikeIndex: number) {
        if (likeIndex > -1) {
            const noneData = { ...editablePost.extendedLikesInfo.likes[likeIndex] }
            delete editablePost.extendedLikesInfo.likes[likeIndex]
            editablePost.extendedLikesInfo.noneEntities.push(noneData)
        }

        if (dislikeIndex > -1) {
            const noneData = { ...editablePost.extendedLikesInfo.dislikes[dislikeIndex] }
            delete editablePost.extendedLikesInfo.dislikes[dislikeIndex]
            editablePost.extendedLikesInfo.noneEntities.push(noneData)
        }

        await editablePost.save()
        return true
    }
}