import { TinaNodeBackend, LocalBackendAuthProvider } from '@tinacms/datalayer'
import databaseClient from '../../../../tina/__generated__/databaseClient'
import { CustomBackendAuth } from '../../../../tina/CustomBackendAuth'

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === 'true'

const handler = TinaNodeBackend({
  authProvider: isLocal
    ? LocalBackendAuthProvider()
    : CustomBackendAuth(), // AuthJsBackendAuthProvider(TinaAuthJSOptions),
  databaseClient,
})

export default (req, res) => {
 console.log('TinaNodeBackend handler called', req.method, req.url)
  return handler(req, res)
}