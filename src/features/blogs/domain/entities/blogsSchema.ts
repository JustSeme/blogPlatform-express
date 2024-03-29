import mongoose from "mongoose";
import { BlogViewModel } from "../../api/models/BlogViewModel";

export const blogsSchema = new mongoose.Schema<BlogViewModel>({
    id: { type: String, required: true },
    name: { type: String, required: true, min: 3, max: 15 },
    description: { type: String, required: true, min: 3, max: 500 },
    websiteUrl: { type: String, required: true, min: 3, max: 100 },
    createdAt: { type: String, required: true },
    isMembership: { type: Boolean, required: true }
})