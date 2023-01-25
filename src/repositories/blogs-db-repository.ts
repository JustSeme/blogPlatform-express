import { BlogInputModel } from "../models/blogs/BlogInputModel";
import { BlogViewModel } from "../models/blogs/BlogViewModel";
import { blogsCollection } from "./db";

export const blogsRepository = {
    async findBlogs(id: string | null): Promise<BlogViewModel[] | BlogViewModel | null> {
        if(id === null) {
            return await blogsCollection.find({}, { projection: { _id: 0 } }).toArray()
        }
        return await blogsCollection.findOne({id: id}, { projection: { _id: 0 } })
    },

    async deleteBlog(id: string | null) {
        let result
        if(id === null) {
            result = await blogsCollection.deleteMany({})
            return result.deletedCount > 0
        }
        
        result = await blogsCollection.deleteOne({id: id})
        return result.deletedCount === 1
    },

    async createBlog(body: BlogInputModel): Promise<BlogViewModel> {
        const createdBlog: BlogViewModel = {
            id: Date.now().toString(),
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl,
            createdAt: new Date().toISOString(),
        }

        await blogsCollection.insertOne(createdBlog)
        
        //@ts-ignore
        delete createdBlog._id
        return createdBlog
    },

    async updateBlog(id: string, body: BlogInputModel) {
        const result = await blogsCollection.updateOne({id: id}, {$set: {name: body.name, description: body.description, websiteUrl: body.websiteUrl}})

        return result.matchedCount === 1
    }
}