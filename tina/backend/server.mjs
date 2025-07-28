import express from 'express';
import { TinaNodeBackend, LocalBackendAuthProvider } from '@tinacms/datalayer';
import { databaseClient } from '../__generated__/databaseClient.js';

const app = express();
const port = 4001;

// 1. Middleware CORS y JSON
app.use(express.json({ limit: '50mb' }));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4321');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// 2. Tina backend
const backend = TinaNodeBackend({
  authProvider: LocalBackendAuthProvider(),
  databaseClient: {
    ...databaseClient,
    ping: async () => ({ status: 'active', collections: Object.keys(databaseClient.collections) }),
  },
});

// 3. Manejador principal para POST /tina/*
app.post(/^\/tina(\/.*)?$/, async (req, res) => {
  const originalPath = req.path;
  const internalPath = originalPath.replace(/^\/tina/, '') || '/graphql';
  console.log(`📥 Petición recibida en: ${originalPath}`);
  console.log(`🔄 Ruta interna convertida: ${internalPath}`);

  try {
    const tinaReq = {
      method: req.method,
      url: internalPath, // EJ: '/graphql'
      headers: {
        ...req.headers,
        'content-type': 'application/json',
      },
      body: JSON.stringify(req.body),
    };

    let responsePayload = '';
    const tinaRes = {
      setHeader: (k, v) => res.setHeader(k, v),
      write: (chunk) => (responsePayload += chunk),
      end: () => {},
      statusCode: 200,
      getHeaders: () => ({}),
    };

    await backend(tinaReq, tinaRes);

    res.status(tinaRes.statusCode)
      .set('Content-Type', 'application/json')
      .send(responsePayload);
  } catch (error) {
    console.error(`💥 Error en ${originalPath}:`, error.message);
    res.status(500).json({
      error: 'Tina Processing Error',
      path: originalPath,
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined,
    });
  }
});

// 4. OPTIONS para CORS
app.options(/^\/tina(\/.*)?$/, (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4321');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(204);
});

// 5. Endpoint /tina/health
app.get('/tina/health', async (req, res) => {
  try {
    const dbStatus = await databaseClient.ping();
    res.json({
      status: 'ok',
      tinaVersion: '1.5.2',
      database: dbStatus,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      error: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`
  🚀 TinaCMS Backend Operativo
  • URL Base: http://localhost:${port}
  • Endpoint: POST http://localhost:${port}/tina/graphql
  • Health:   GET http://localhost:${port}/tina/health
  `);
});
