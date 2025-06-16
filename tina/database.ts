import { createDatabase } from "@tinacms/datalayer";
import { GitHubProvider } from "tinacms-gitprovider-github/dist";


export default (async () => {

    const module = await import('mongodb-level');

    const MongodbLevel =
        module?.MongodbLevel ||
        module?.default?.MongodbLevel ||
        module?.default;

    return createDatabase({
        gitProvider: new GitHubProvider({
            repo: process.env.GITHUB_REPO!,
            owner: process.env.GITHUB_OWNER!,
           // token: process.env.GITHUB_PERSONAL_ACCESS_TOKEN!,
            branch: process.env.GITHUB_BRANCH || "main"
        }),
        databaseAdapter: new MongodbLevel({
            collectionName: "tinacms",
            dbName: "tinacms",
            mongoUri: 'mongodb://root:tina-startlight@172.17.0.1:27017',
        }),
        useLocalClient: true // Necesario para self-hosted
    })
})()