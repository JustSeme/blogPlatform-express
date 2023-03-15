import { runDB } from './repositories/db'
import { app, settings } from './settings'

const port = settings.PORT

export let server: any
const startApp = async () => {
    await runDB()
    server = app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    })
}

startApp()