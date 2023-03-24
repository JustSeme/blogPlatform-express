import { LikeType } from "../comments/LikeInputModel"

export type PostsViewModel = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
    extendedLikesInfo: ExtendedLikesInfoViewType
}

type ExtendedLikesInfoViewType = {
    likesCount: number,
    dislikesCount: number,
    myStatus: LikeType,
    newestLikes: NewestLikesType[]
}

type NewestLikesType = {
    addedAt: string,
    userId: string,
    login: string
}