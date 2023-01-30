import { BlogInputModel } from "../models/blogs/BlogInputModel";
import { BlogViewModel } from "../models/blogs/BlogViewModel";
import { blogsCollection } from "./db";

export const blogsRepository = {
    async deleteBlog(id: string | null) {
        let result
        if(id === null) {
            result = await blogsCollection.deleteMany({})
            return result.deletedCount > 0
        }
        
        result = await blogsCollection.deleteOne({id: id})
        return result.deletedCount === 1
    },

    async createBlog(createdBlog: BlogViewModel) {
        await blogsCollection.insertOne(createdBlog)
    },

    async updateBlog(id: string, body: BlogInputModel) {
        const result = await blogsCollection.updateOne({id: id}, {$set: {name: body.name, description: body.description, websiteUrl: body.websiteUrl}})

        return result.matchedCount === 1
    }
}