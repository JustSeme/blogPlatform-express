import { v4 as uuidv4 } from "uuid"

//data transfer object
export class PostDBModel {
    public id: string
    public createdAt: string

    constructor(
        public title: string,
        public shortDescription: string,
        public content: string,
        public blogId: string,
        public blogName: string
    ) {
        this.id = uuidv4()
        this.createdAt = new Date().toISOString()
    }
}

export type PostsWithQueryOutputModel = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: PostDBModel[]
}