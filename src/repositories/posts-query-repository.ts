import { postsCollection } from "./db";
import { PostsWithQueryOutputModel, PostViewModel } from "../models/posts/PostViewModel";
import { ReadPostsQueryParams } from "../routes/posts-router";

export const postsQueryRepository = {
    async findPosts(queryParams: ReadPostsQueryParams): Promise<PostsWithQueryOutputModel> {
        const { sortDirection, sortBy, pageNumber, pageSize } = queryParams
        let postsCursor = await postsCollection.find({}, { projection: { _id: 0 }})

        const sortDirectionNumber = sortDirection === 'asc' ? 1 : -1
        const resultedPosts = await postsCursor.sort({[sortBy]: sortDirectionNumber}).toArray()
        
        return {
            pagesCount: 20,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: 100,
            items: resultedPosts
        }
    },

    async findPostsById(id: string): Promise<PostViewModel | null> {
        return await postsCollection.findOne({id: id}, { projection: { _id: 0 } })
    }
}