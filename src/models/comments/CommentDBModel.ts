import { v4 as uuidv4 } from 'uuid'

export class CommentDBModel {
    public id: string
    public createdAt: string

    public commentatorInfo: CommentatorInfoType
    constructor(
        public content: string,
        public postId: string,
        userId: string,
        userLogin: string
    ) {
        this.id = uuidv4()
        this.createdAt = new Date().toISOString()
        this.commentatorInfo = {
            userId,
            userLogin
        }
    }
}

type CommentatorInfoType = {
    userId: string
    userLogin: string
}