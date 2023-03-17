import { v4 as uuidv4 } from 'uuid'

export class CommentDBModel {
    public id: string
    public createdAt: string

    public commentatorInfo: CommentatorInfoType
    public likesInfo: LikesInfoType
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
        this.likesInfo = {
            likesCount: 0,
            dislikesCount: 0,
            myStatus: 'None'
        }
    }

    //here will be a method which set myStatus depending on user
}

type CommentatorInfoType = {
    userId: string
    userLogin: string
}

type LikesInfoType = {
    likesCount: number,
    dislikesCount: number,
    myStatus: 'None' | 'Like' | 'Dislike'
}