import express, { Response, Request } from 'express'
import { videosRepository } from './repositories/videos-in-memory-repository'
import { videosRouter } from './routes/videos-router'
import { blogsRouter } from './routes/blogs-router'
import { blogsRepository } from './repositories/blogs-db-repository'
import { postsRouter } from './routes/posts-router'
import { postsRepository } from './repositories/posts-db-repository'
import { runDB } from './repositories/db'
import { usersRouter } from './routes/users-router'
import { authRouter } from './routes/auth-router'

export const app = express()
const port = process.env.PORT || 3000
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

const startApp = async () => {
    await runDB()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    })
}

app.use('/homeworks/videos', videosRouter)

app.use('/homeworks/blogs', blogsRouter)
app.use('/homeworks/posts', postsRouter)

app.use('/homeworks/users', usersRouter)
app.use('/homeworks/auth', authRouter)

app.delete('/homework01/testing/all-data', async (req: Request, res: Response) => {
    await videosRepository.deleteVideo(null)
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

app.delete('/homeworks/testing/all-data', async (req: Request, res: Response) => {
    await postsRepository.deletePosts(null)
    await blogsRepository.deleteBlog(null)
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})


startApp()