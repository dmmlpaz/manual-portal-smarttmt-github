// src/pages/api/tina/[...routes].ts
import type { APIRoute } from 'astro';
import { TinaNodeBackend } from '@tinacms/datalayer';
import databaseClient from '../../../../tina/__generated__/databaseClient';
import { CustomBackendAuth } from '../../../../tina/CustomBackendAuth';
import type { IncomingMessage, ServerResponse } from 'http';

const backend = TinaNodeBackend({
  authProvider: CustomBackendAuth(),
  databaseClient,
});


export const all: APIRoute = async ({ request }) => {
  const url = new URL(request.url);

  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });

  const bodyText = await request.text();

  const req = {
    method: request.method,
    url: url.pathname.replace(/^\/api\/tina/, '') || '/',
    headers,
    body: bodyText,
  } as unknown as IncomingMessage;

  let responseBody = '';
  const res = {
    setHeader: () => {},
    write: (chunk: string) => (responseBody += chunk),
    end: () => {},
    statusCode: 200,
  } as unknown as ServerResponse;

  await backend(req, res);

  return new Response(responseBody, {
    status: res.statusCode,
    headers: { 'Content-Type': 'application/json' },
  });
};
