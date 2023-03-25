import { HTTP_STATUSES } from '../../../../settings'
import { BlogInputModel } from "../../application/dto/BlogInputModel";
import { BlogViewModel } from "../models/BlogViewModel";
import { ErrorMessagesOutputModel } from "../../../../models/ErrorMessagesOutputModel";
import { BlogsService } from "../../application/blogs-service";
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithParamsAndQuery } from "../../../../types/types";
import { blogsQueryRepository } from "../../infrastructure/blogs-query-repository";
import { BlogsWithQueryOutputModel } from '../models/BlogViewModel'
import { RequestWithQuery } from '../../../../types/types'
import { PostsWithQueryOutputModel } from "../../domain/entities/PostDBModel";
import { PostInputModel } from "../../application/dto/PostInputModel";
import { PostsService } from "../../application/posts-service";
import { ReadBlogsQueryParams } from "../../../../models/blogs/ReadBlogsQuery";
import { ReadPostsQueryParams } from "../../../../models/posts/ReadPostsQuery";
import { Response } from 'express';
import { injectable } from 'inversify/lib/annotation/injectable';
import { PostsViewModel } from '../models/PostViewModel';

@injectable()
export class BlogsController {
    constructor(protected blogsService: BlogsService, protected postsService: PostsService) { }

    async getBlogs(req: RequestWithQuery<ReadBlogsQueryParams>, res: Response<BlogsWithQueryOutputModel>) {
        const findedBlogs = await blogsQueryRepository.findBlogs(req.query)

        if (!findedBlogs.items.length) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        res.send(findedBlogs as BlogsWithQueryOutputModel)
    }

    async getBlogById(req: RequestWithParams<{ id: string }>, res: Response<BlogViewModel>) {
        const findedBlog = await blogsQueryRepository.findBlogById(req.params.id)

        if (!findedBlog) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        res.send(findedBlog)
    }

    async getPostsForBlog(req: RequestWithParamsAndQuery<{ blogId: string }, ReadPostsQueryParams>, res: Response<PostsWithQueryOutputModel>) {
        const accessToken = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null
        const findedPostsForBlog = await this.postsService.findPosts(req.query, req.params.blogId, accessToken)
        if (!findedPostsForBlog.items.length) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        res.send(findedPostsForBlog)
    }

    async createBlog(req: RequestWithBody<BlogInputModel>, res: Response<BlogViewModel | ErrorMessagesOutputModel>) {
        const createdBlog = await this.blogsService.createBlog(req.body)

        res
            .status(HTTP_STATUSES.CREATED_201)
            .send(createdBlog)
    }

    async createPostForBlog(req: RequestWithParamsAndBody<{ blogId: string }, PostInputModel>, res: Response<PostsViewModel>) {
        const createdPost = await this.postsService.createPost(req.body, req.params.blogId)

        res
            .status(HTTP_STATUSES.CREATED_201)
            .send(createdPost)
    }

    async updateBlog(req: RequestWithParamsAndBody<{ id: string }, BlogInputModel>, res: Response<ErrorMessagesOutputModel>) {
        const isUpdated = await this.blogsService.updateBlog(req.params.id, req.body)
        if (!isUpdated) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }

    async deleteBlog(req: RequestWithParams<{ id: string }>, res: Response<ErrorMessagesOutputModel>) {
        const isDeleted = await this.blogsService.deleteBlog(req.params.id)
        if (isDeleted) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
            return
        }
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
}