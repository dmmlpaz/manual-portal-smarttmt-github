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