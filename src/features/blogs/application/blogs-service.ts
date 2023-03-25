import { BlogInputModel } from "./dto/BlogInputModel";
import { BlogViewModel } from "../api/models/BlogViewModel";
import { BlogsRepository } from "../infrastructure/blogs-db-repository";
import { injectable } from 'inversify/lib/annotation/injectable';

@injectable()
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