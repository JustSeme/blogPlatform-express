import { blogsOutputModel } from "../models/blogs/blogsOutputModel";
import { BlogViewModel } from "../models/blogs/BlogViewModel";
import { blogsCollection } from "./db";

export const blogsQueryRepository = {
    async findBlogs(searchNameTerm: string, sortDirection: 'asc' | 'desc' = 'desc', sortBy: string = 'createdAt', pageNumber: number = 1, pageSize: number = 10): Promise<blogsOutputModel> {
        let blogsCursor
        if(searchNameTerm) {
            blogsCursor = await blogsCollection.find({name: {$regex: searchNameTerm}}, { projection: { _id: 0 }})
        } else {
            blogsCursor = await blogsCollection.find({}, { projection: { _id: 0 }})
        }
        const sortDirectionNumber = sortDirection === 'asc' ? -1 : 1
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