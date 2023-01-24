import { MongoClient } from 'mongodb'

const username = "justSeme"
const password = "RMMXpX1hUlXqbKED"

let mongoURI = process.env.mongoURI || `mongodb+srv://${username}:${password}@cluster86890.fgczccf.mongodb.net/?retryWrites=true&w=majority`;

export const client = new MongoClient(mongoURI)

export async function runDB() {
    try {
        await client.connect();
        await client.db("blog_platform").command({ ping: 1 });
        console.log("Connected successfully to MongoDB server");
    } catch (err) {
        await client.close();
        console.log(err);
    }
}
runDB().catch(console.dir) 
