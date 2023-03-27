import { JwtService } from "../../../../application/jwtService";
import { usersQueryRepository } from "../../../auth/infrastructure/users-query-repository";
import { ReadCommentsQueryParams } from "../models/ReadCommentsQuery";
import { CommentsWithQueryOutputModel } from "../models/CommentViewModel";
import { CommentInputModel } from "../../application/dto/CommentInputModel";
import { CommentViewModel } from "../models/CommentViewModel";
import { CommentsService } from "../../application/comments-service";
import { HTTP_STATUSES } from "../../../../settings";
import { ErrorMessagesOutputModel } from "../../../../models/ErrorMessagesOutputModel";
import { PostInputModel } from "../../application/dto/PostInputModel";
import { PostsWithQueryOutputModel } from "../../domain/entities/PostDBModel";
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithParamsAndQuery, RequestWithQuery } from "../../../../types/types";
import { PostsService } from "../../application/posts-service";
import { ReadPostsQueryParams } from "../models/ReadPostsQuery";
import { Response } from "express";
import { injectable } from 'inversify/lib/annotation/injectable';
import { LikeInputModel } from "../../application/dto/LikeInputModel";
import { PostsViewModel } from "../models/PostViewModel";

@injectable()
export class PostsController {
    constructor(protected jwtService: JwtService, protected postsService: PostsService, protected commentsService: CommentsService) { }

    async getPosts(req: RequestWithQuery<ReadPostsQueryParams>, res: Response<PostsWithQueryOutputModel>) {
        const accessToken = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null
        const findedPosts = await this.postsService.findPosts(req.query, null, accessToken)

        if (!findedPosts.items.length) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        res.json(findedPosts)
    }

    async getPostById(req: RequestWithParams<{ id: string }>, res: Response<PostsViewModel>) {
        const accessToken = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null
        const findedPosts = await this.postsService.findPostById(req.params.id, accessToken)

        if (!findedPosts) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        res.json(findedPosts)
    }

    async getCommentsForPost(req: RequestWithParamsAndQuery<{ postId: string }, ReadCommentsQueryParams>, res: Response<CommentsWithQueryOutputModel>) {
        const accessToken = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null

        const findedComments = await this.commentsService.getComments(req.query, req.params.postId, accessToken)
        res.send(findedComments)
    }

    async createPost(req: RequestWithBody<PostInputModel>, res: Response<PostsViewModel | ErrorMessagesOutputModel>) {
        const createdPost = await this.postsService.createPost(req.body, null)

        res
            .status(HTTP_STATUSES.CREATED_201)
            .send(createdPost)
    }

    async createCommentForPost(req: RequestWithParamsAndBody<{ postId: string }, CommentInputModel>, res: Response<CommentViewModel | ErrorMessagesOutputModel>) {
        const token = req.headers.authorization!.split(' ')[1]
        const userId = await this.jwtService.getUserIdByToken(token)
        const commentator = await usersQueryRepository.findUserById(userId)

        const createdComment = await this.commentsService.createComment(req.body.content, commentator, req.params.postId)
        if (!createdComment) {
            res.sendStatus(HTTP_STATUSES.NOT_IMPLEMENTED_501)
            return
        }

        res
            .status(HTTP_STATUSES.CREATED_201)
            .send(createdComment)
    }

    async updatePost(req: RequestWithParamsAndBody<{ id: string }, PostInputModel>, res: Response<PostsViewModel | ErrorMessagesOutputModel>) {
        const isUpdated = await this.postsService.updatePost(req.params.id, req.body)
        if (!isUpdated) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }

    async deletePost(req: RequestWithParams<{ id: string }>, res: Response<ErrorMessagesOutputModel>) {
        const isDeleted = await this.postsService.deletePosts(req.params.id)
        if (isDeleted) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
            return
        }

        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }

    async updateLikeStatus(req: RequestWithParamsAndBody<{ postId: string }, LikeInputModel>, res: Response) {
        const accessToken = req.headers.authorization!.split(' ')[1]
        const isUpdated = await this.postsService.updateLike(accessToken, req.params.postId, req.body.likeStatus)
        if (!isUpdated) {
            res.sendStatus(HTTP_STATUSES.NOT_IMPLEMENTED_501)
            return
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }
}