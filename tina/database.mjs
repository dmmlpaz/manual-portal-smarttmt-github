import { RedisLevel } from 'upstash-redis-level'

export default isLocal
    ? createLocalDatabase()
    : createDatabase({
        gitProvider: new GitHubProvider({
            repo: process.env.GITHUB_REPO,
            owner: process.env.GITHUB_OWNER,
            token: process.env.GITHUB_TOKEN,
            branch: process.env.GITHUB_BRANCH || "main"
        }),

        databaseAdapter: new RedisLevel({
            namespace: branch,
            redis: {
                url: process.env.KV_REST_API_URL || 'http://localhost:8079',
                token: process.env.KV_REST_API_TOKEN || 'example_token',
            },
            debug: process.env.DEBUG === 'true' || false,
        }),
    })