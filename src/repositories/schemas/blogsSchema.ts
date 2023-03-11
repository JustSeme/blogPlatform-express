import mongoose from "mongoose";
import { BlogViewModel } from "../../models/blogs/BlogViewModel";

export const blogsSchema = new mongoose.Schema<BlogViewModel>({
    id: { type: String, required: true },
    name: { type: String, required: true, min: 3, max: 15 },
    description: { type: String, required: true, min: 3, max: 500 },
    websiteUrl: { type: String, required: true, min: 3, max: 100 },
    createdAt: { type: String, required: true },
    isMembership: { type: Boolean, required: true }
})

blogsSchema.path('websiteUrl').validate((val) => {
    const urlRegex = new RegExp('^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$')
    return urlRegex.test(val);
}, 'Invalid URL.');