import type { APIRoute } from 'astro';
import { TinaNodeBackend,LocalBackendAuthProvider } from '@tinacms/datalayer';
import { CustomBackendAuth } from '../../../../tina/CustomBackendAuth';
import databaseClient from '../../../../tina/__generated__/databaseClient';
import type { IncomingMessage, ServerResponse } from 'http';
import { Readable } from 'stream';

const backend = TinaNodeBackend({
  authProvider: CustomBackendAuth(),
  databaseClient,
});

export const POST: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const headers: Record<string, string> = {};
  request.headers.forEach((v, k) => (headers[k.toLowerCase()] = v)); // ✅ asegúrate de usar lowercase

  // ⚠️ fuerza content-type en minúsculas
  if (headers['Content-Type']) {
    headers['content-type'] = headers['Content-Type'];
    delete headers['Content-Type'];
  }

  const bodyText = await request.text();

  const req = Object.assign(Readable.from([bodyText]), {
    method: request.method,
    url: url.pathname.replace(/^\/api\/tina/, '') || '/graphql',
    headers,
  }) as unknown as IncomingMessage;

  let responseBody = '';
  const res = {
    setHeader: () => {},
    write: (chunk: string) => {
      responseBody += chunk;
    },
    end: () => {},
    statusCode: 200,
  } as unknown as ServerResponse;

  console.log('Calling Tina backend with:', {
    method: req.method,
    url: req.url,
    headers: req.headers,
  });

  await backend(req, res);

  return new Response(responseBody, {
    status: res.statusCode,
    headers: { 'Content-Type': 'application/json' },
  });
};
