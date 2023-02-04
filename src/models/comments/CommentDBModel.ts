export type CommentDBModel = {
    id: string
    content: string,
    commentatorInfo: {
        userId: string
        userLogin: string
    },
    createdAt: string,
    postId: string
}