import type { APIRoute } from 'astro';
import { TinaNodeBackend, LocalBackendAuthProvider } from '@tinacms/datalayer';
import databaseClient from '../../../../tina/__generated__/databaseClient'
import type { IncomingMessage, ServerResponse } from 'http';

const backend = TinaNodeBackend({
  authProvider: {
    isAuthorized: async (req: IncomingMessage, res: ServerResponse) => {
      console.log('Checking authorization...',req.url, req.method, req.headers);
      return {
        isAuthorized: true,
      };
    },
  },
  databaseClient,
});

export const POST: APIRoute = async ({ request }) => {
  try {
    console.log('ttrazaaaaaa 111 request:', request);
    // Convertir la solicitud de Astro a formato Node.js
    const req = {
      method: 'POST',
      url: '/api/tina',
      headers: {
        'content-type': 'application/json',
      },
      body: await request.text(),
    } as unknown as IncomingMessage;

    let body = '';
    const res = {
      setHeader: (key: string, value: string) => {},
      write: (chunk: string) => { body += chunk; },
      end: () => {},
      statusCode: 200,
    } as unknown as ServerResponse<IncomingMessage>;

    console.log('ttrazaaaaaa');

    // Ejecutar el manejador de Tina
    const result = await backend(req, res);

     console.log('ttrazaaaaaa 222 result:;');

    // Devolver la respuesta
    return new Response(body, {
      status: res.statusCode,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    const errorMessage = typeof error === 'object' && error !== null && 'message' in error
      ? (error as { message: string }).message
      : String(error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' },
  });
};