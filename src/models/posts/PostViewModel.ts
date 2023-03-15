export type PostViewModel = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
    likesInfo: LikesInfoType
}

export type PostsWithQueryOutputModel = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: PostViewModel[]
}

type LikesInfoType = {
    likesCount: number,
    dislikesCount: number,
    myStatus: 'None' | 'Like' | 'Dislike'
}