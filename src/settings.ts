const username = "justSeme"
const password = "RMMXpX1hUlXqbKED"

export const settings = {
    mongoURI: process.env.mongoURI || `mongodb+srv://${username}:${password}@cluster86890.fgczccf.mongodb.net/?retryWrites=true&w=majority`,
    JWT_SECRET: process.env.JWT_SECRET || '123',
    PORT: process.env.PORT || 3000
}