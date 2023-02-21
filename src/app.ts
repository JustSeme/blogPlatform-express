import express, { Response, Request } from 'express'
import { videosRepository } from './repositories/videos-in-memory-repository'
import { videosRouter } from './routes/videos-router'
import { blogsRouter } from './routes/blogs-router'
import { postsRouter } from './routes/posts-router'
import { runDB } from './repositories/db'
import { usersRouter } from './routes/users-router'
import { authRouter } from './routes/auth-router'
import { postsService } from './domain/posts-service'
import { blogsService } from './domain/blogs-service'
import { authService } from './domain/auth-service'
import { settings } from './settings'
import { commentsRouter } from './routes/comments-router'
import cookieParser from 'cookie-parser'

export const app = express()
const port = settings.PORT
const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)
app.use(cookieParser())
app.set('trust proxy', true)

export const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,

    NOT_FOUND_404: 404,
    BAD_REQUEST_400: 400,
    UNAUTHORIZED_401: 401,
    FORBIDDEN_403: 403,
    TOO_MANY_REQUESTS_429: 429,

    NOT_IMPLEMENTED_501: 501
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

app.use('/homeworks/comments', commentsRouter)

app.delete('/homework01/testing/all-data', async (req: Request, res: Response) => {
    await videosRepository.deleteVideo(null)
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

app.delete('/homeworks/testing/all-data', async (req: Request, res: Response) => {
    await postsService.deletePosts(null)
    await blogsService.deleteBlog(null)
    await authService.deleteUsers(null)
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})


startApp()