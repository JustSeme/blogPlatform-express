import { runDB } from './repositories/db'
import { app, settings } from './settings'

const port = settings.PORT

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

export let server: any
const startApp = async () => {
    await runDB()
    server = app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    })
}

startApp()