export type LikeModel = {
    likeStatus: likeEnum
}

enum likeEnum {
    None = 'None',
    Like = 'Like',
    Dislike = 'Dislike',
}