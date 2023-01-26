import { blogsOutputModel } from "../models/blogs/blogsOutputModel";
import { BlogViewModel } from "../models/blogs/BlogViewModel";
import { readBlogsQueryParams } from "../routes/blogs-router";
import { blogsCollection } from "./db";

export const blogsQueryRepository = {
    async findBlogs(params: readBlogsQueryParams): Promise<blogsOutputModel> {
        let resultedBlogs: BlogViewModel
        resultedBlogs = await blogsCollection.find({name: params.searchNameTerm})
        
        return 
    }
}