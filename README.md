# Configuracion Tina

    -- Url del admin http://localhost:4321/admin/index.html

    1. Archivo config.ts permite definir el self-hoste auto hospedaje Tina Config:

        const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === "true";

        import { defineConfig,LocalAuthProvider} from "tinacms";
        import { CustomAuthProvider } from "./CustomAuthProvider";
        import {
        UsernamePasswordAuthJSProvider,
        TinaUserCollection,
        } from "tinacms-authjs/dist/tinacms";


        const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === "true";

        export default defineConfig({
        authProvider: isLocal
        ? new LocalAuthProvider()
        : new UsernamePasswordAuthJSProvider(),
        contentApiUrlOverride: "/api/tina/gql",
        build: {
        outputFolder: "admin",
        publicFolder: "public",
        },
        media: {
        tina: {
        mediaRoot: "",
        publicFolder: "public",
        },
        },
        // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/schema/
        schema: {
        collections: [

        TinaUserCollection,
        ],

        },

        cmsCallback: (cms) => {
        // Deshabilitar la creación de archivos .gitkeep.md
        cms.flags.set('tina-admin', {
        useGitKeep: false
        });
        return cms;
        },

        });

    2. Archivo [...routes].ts Tina Backend

        // pages/api/tina/[...routes].ts
        import { LocalBackendAuthProvider, TinaNodeBackend } from '@tinacms/datalayer';
        import databaseClient from './__generated__/databaseClient';
        import { AuthJsBackendAuthProvider, TinaAuthJSOptions } from 'tinacms-authjs';


        const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === 'true'


        const handler = TinaNodeBackend({
        authProvider: isLocal
        ? LocalBackendAuthProvider()
        : AuthJsBackendAuthProvider({
        authOptions: TinaAuthJSOptions({
            databaseClient: databaseClient,
            secret: process.env.NEXTAUTH_SECRET ?? '',
        }),
        }),
        databaseClient,
        })



        export default (req: any, res: any): Promise<void> | void => {
        return handler(req, res)
        }

    3. Archivo a crear nombre database.ts donde se configura los enlaces a la base de datos y al repositio de git

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

    4. Para usuario desde el proyecto para el TinaUserCollection se de bebe crear el archvio src/content/users/index.json

        {
            "users": [
            {
                "name": "Tina User",
                "email": "user@tina.io",
                "username": "admin",
                "password": "admin"
            }
        ]
        }