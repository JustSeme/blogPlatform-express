import mongoose from "mongoose";
import { BlogViewModel } from "../../models/blogs/BlogViewModel";

export const blogsSchema = new mongoose.Schema<BlogViewModel>({
    id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    websiteUrl: { type: String, required: true },
    createdAt: { type: String, required: true },
    isMembership: { type: Boolean, required: true }
})