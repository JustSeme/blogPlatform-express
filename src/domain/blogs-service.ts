import { BlogInputModel } from "../models/blogs/BlogInputModel";
import { BlogViewModel } from "../models/blogs/BlogViewModel";
import { BlogsRepository } from "../repositories/blogs-db-repository";

export class BlogsService {
    constructor(protected blogsRepository: BlogsRepository) { }

    async deleteBlog(id: string) {
        return this.blogsRepository.deleteBlog(id)
    }

    async createBlog(body: BlogInputModel): Promise<BlogViewModel> {
        const createdBlog: BlogViewModel = {
            id: Date.now().toString(),
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }

        await this.blogsRepository.createBlog(createdBlog)

        return createdBlog
    }

    async updateBlog(id: string, body: BlogInputModel) {
        return await this.blogsRepository.updateBlog(id, body)
    }
}