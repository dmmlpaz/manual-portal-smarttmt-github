import type { APIRoute } from 'astro';
import { TinaNodeBackend, LocalBackendAuthProvider } from '@tinacms/datalayer';
import databaseClient from '../../../../tina/__generated__/databaseClient';
import { IncomingMessage } from 'http';
import { Readable } from 'stream';

const backend = TinaNodeBackend({
  authProvider: LocalBackendAuthProvider(),
  databaseClient,
});

class MockServerResponse {
  headers: Record<string, string> = {};
  chunks: Uint8Array[] = [];
  statusCode: number = 200;

  writeHead(statusCode: number, headers?: Record<string, string>) {
    this.statusCode = statusCode;
    if (headers) {
      this.headers = headers;
    }
  }

  setHeader(key: string, value: string) {
    this.headers[key.toLowerCase()] = value;
  }

  getHeader(key: string) {
    return this.headers[key.toLowerCase()];
  }

  getHeaders() {
    return this.headers;
  }

  write(chunk: any) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    this.chunks.push(buffer);
    return true;
  }

  end(chunk?: any) {
    if (chunk) this.write(chunk);
    // Aquí no retornamos nada; llamaremos manualmente el .toResponse()
  }

  toResponse(): Response {
    const body = Buffer.concat(this.chunks).toString();
    return new Response(body, {
      status: this.statusCode,
      headers: this.headers,
    });
  }
}

export const ALL: APIRoute = async ({ request }) => {
  const body = await request.text();
  const headers = Object.fromEntries(request.headers.entries());

  const req = new Readable() as IncomingMessage & { body?: any };
  req.headers = headers;
  req.method = request.method;
  req.url = request.url;
  req.push(body);
  req.push(null);

  try {
    req.body = JSON.parse(body);
  } catch {
    req.body = body;
  }

  const res = new MockServerResponse();
  console.log('Request URL:', req.url);
  await backend(req, res as any);
   console.log('paso');
  return res.toResponse();
};