export type CommentViewModel = {
    id: string
    content: string,
    commentatorInfo: {
        userId: string
        userLogin: string
    },
    createdAt: string
}

export type CommentsWithQueryOutputModel = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: CommentViewModel[]
}