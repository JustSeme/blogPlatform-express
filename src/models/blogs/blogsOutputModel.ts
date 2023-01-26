import { VideoViewModel } from "../videos/VideoViewModel"

export type blogsOutputModel = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: VideoViewModel[]
}