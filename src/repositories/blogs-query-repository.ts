import { BlogsWithQueryOutputModel } from "../models/blogs/BlogViewModel";
import { BlogViewModel } from "../models/blogs/BlogViewModel";
import { blogsCollection } from "./db";
import { ReadBlogsQueryParams } from "../routes/blogs-router";

export const blogsQueryRepository = {
    async findBlogs(queryParams: ReadBlogsQueryParams): Promise<BlogsWithQueryOutputModel> {
        const { searchNameTerm, sortDirection, sortBy, pageNumber, pageSize } = queryParams
        let blogsCursor
        if(searchNameTerm) {
            blogsCursor = await blogsCollection.find({name: {$regex: searchNameTerm}}, { projection: { _id: 0 }})
        } else {
            blogsCursor = await blogsCollection.find({}, { projection: { _id: 0 }})
        }
        const sortDirectionNumber = sortDirection === 'asc' ? 1 : -1
        const resultedBlogs = await blogsCursor.sort({[sortBy]: sortDirectionNumber}).toArray()
        
        return {
            pagesCount: 20,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: 100,
            items: resultedBlogs
        }
    },

    async findBlogById(id: string): Promise<BlogViewModel | null> {
        return await blogsCollection.findOne({id: id}, { projection: { _id: 0 } })
    }
}