import { MongodbLevel } from "mongodb-level"
import { createDatabase } from "@tinacms/datalayer";
import { GitHubProvider } from "tinacms-gitprovider-github";


export default createDatabase({
    gitProvider: new GitHubProvider({
        repo: 'https://github.com/dmmlpaz/manual-portal-smarttmt-github',
        owner: 'dmmlpaz',
        token: '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',
        branch: process.env.GITHUB_BRANCH || "main"
    }),
    databaseAdapter: new MongodbLevel({
        collectionName: "tinacms",
        dbName: "tinacms",
        mongoUri: 'mongodb://root:tina-startlight@172.17.0.1:27017',
    }),
    useLocalClient: true // Necesario para self-hosted
});