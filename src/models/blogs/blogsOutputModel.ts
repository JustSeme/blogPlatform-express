import { BlogViewModel } from "./BlogViewModel"

export type blogsOutputModel = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: BlogViewModel[]
}