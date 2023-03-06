import cookieParser from "cookie-parser"
import express, { Request, Response } from "express"
import { videosRepository } from './repositories/videos-in-memory-repository'
import { videosRouter } from './routes/videos-router'
import { blogsRouter } from './routes/blogs-router'
import { postsRouter } from './routes/posts-router'
import { usersRouter } from './routes/users-router'
import { authRouter } from './routes/auth-router'
import { postsService } from './domain/posts-service'
import { blogsService } from './domain/blogs-service'
import { authService } from './domain/auth-service'
import { commentsRouter } from './routes/comments-router'
import { securityRouter } from './routes/security-router'
import { attemptsRepository } from './repositories/attempts-db-repository'
import { HTTP_STATUSES } from "./app"

const username = "justSeme"
const password = "RMMXpX1hUlXqbKED"

export const settings = {
    mongoURI: process.env.mongoURI || `mongodb+srv://${username}:${password}@cluster86890.fgczccf.mongodb.net/?retryWrites=true&w=majority`,
    JWT_SECRET: process.env.JWT_SECRET || 'super_secret',
    PORT: process.env.PORT || 3000,
    GMAIL_LOGIN: process.env.GMAIL_LOGIN || 'kepxep69@gmail.com',
    GMAIL_APP_PASSWORD: process.env.GMAIL_APP_PASSWORD || 'gpllbohdhqcrdvnh'
}

export const app = express()
const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)
app.use(cookieParser())
app.set('trust proxy', true)

app.use('/homeworks/videos', videosRouter)

app.use('/homeworks/blogs', blogsRouter)
app.use('/homeworks/posts', postsRouter)

app.use('/homeworks/users', usersRouter)
app.use('/homeworks/auth', authRouter)

app.use('/homeworks/comments', commentsRouter)

app.use('/homeworks/security', securityRouter)

app.delete('/homework01/testing/all-data', async (req: Request, res: Response) => {
    await videosRepository.deleteVideo(null)
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

app.delete('/homeworks/testing/all-data', async (req: Request, res: Response) => {
    await postsService.deletePosts(null)
    await blogsService.deleteBlog(null)
    await authService.deleteUsers(null)
    await attemptsRepository.clearAllAttempts()
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})