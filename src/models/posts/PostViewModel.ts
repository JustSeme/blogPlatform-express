export type PostViewModel = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string
}

export type PostsWithQueryOutputModel = {
    pagesCount: number
    page: string
    pageSize: string
    totalCount: number
    items: PostViewModel[]
}