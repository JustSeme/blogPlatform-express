import express, { Response, Request } from 'express'
import { videosRepository } from './repositories/videos-repository'
import { videosRouter } from './routes/videos-router'
import { blogsRouter } from './routes/blogs-router'
import { blogsRepository } from './repositories/blogs-repository'
import { postsRouter } from './routes/posts-router'
import { postsRepository } from './repositories/posts-repository'

export const app = express()
const port = 3000
const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)

export const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,

    NOT_FOUND_404: 404,
    BAD_REQUEST_400: 400,
    UNAUTHORIZED_401: 401
}

app.use('/homework01/videos', videosRouter)

app.use('/homework02/blogs', blogsRouter)
app.use('/homework02/posts', postsRouter)

app.delete('/homework01/testing/all-data', (req: Request, res: Response) => {
    videosRepository.deleteVideo(null)
    blogsRepository.deleteBlog(null)
    postsRepository.deletePosts(null)
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})