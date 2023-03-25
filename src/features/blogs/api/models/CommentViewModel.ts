import { LikeType } from "../../application/dto/LikeInputModel"

export type CommentViewModel = {
    id: string
    content: string,
    commentatorInfo: {
        userId: string
        userLogin: string
    },
    createdAt: string,
    likesInfo: {
        likesCount: number,
        dislikesCount: number,
        myStatus: LikeType
    }
}

export type CommentsWithQueryOutputModel = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: CommentViewModel[]
}