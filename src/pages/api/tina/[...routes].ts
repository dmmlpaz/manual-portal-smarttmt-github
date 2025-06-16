import { TinaNodeBackend, LocalBackendAuthProvider } from '@tinacms/datalayer'
import databaseClient from '../../../../tina/__generated__/databaseClient'
import type { IncomingMessage, ServerResponse } from 'http'


const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === 'true'

const handler = TinaNodeBackend({
  authProvider: LocalBackendAuthProvider(),
  databaseClient,
})

export default (req: IncomingMessage, res: ServerResponse<IncomingMessage>) => {
 console.log('TinaNodeBackend handler called', req.method, req.url)
  return handler(req, res)
}