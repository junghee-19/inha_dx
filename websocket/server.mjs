import http from 'node:http';
import { WebSocketServer } from 'ws';

const SENSOR_MIN = 0;
const SENSOR_MAX = 11;
const BUILDING_COUNT = Math.max(1, Number(process.env.BUILDING_COUNT ?? 11));

const defaultState = {
  buildingId: null,
  sensorCode: null,
  touchedAt: null,
};

const latestReading = { ...defaultState };

const mapSensorCodeToBuildingId = (code) => {
  if (typeof code !== 'number' || Number.isNaN(code)) {
    return null;
  }
  if (code < SENSOR_MIN || code > SENSOR_MAX) {
    return null;
  }
  if (code === 0) {
    return 1;
  }
  const capped = Math.min(code, BUILDING_COUNT);
  return capped;
};

const updateLatestReading = (sensorCode) => {
  const buildingId = mapSensorCodeToBuildingId(sensorCode);
  if (buildingId === null) {
    return false;
  }
  latestReading.sensorCode = sensorCode;
  latestReading.buildingId = buildingId;
  latestReading.touchedAt = new Date().toISOString();
  return true;
};

const ALLOWED_ORIGIN = process.env.CORS_ORIGIN ?? '*';

const sendCorsHeaders = (res) => {
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

const createHttpServer = () => {
  const host = process.env.HTTP_HOST ?? '0.0.0.0';
  const port = Number(process.env.HTTP_PORT ?? 4000);

  const server = http.createServer((req, res) => {
    sendCorsHeaders(res);

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    const requestUrl = new URL(req.url ?? '/', `http://${req.headers.host ?? `${host}:${port}`}`);

    if (req.method === 'GET' && requestUrl.pathname === '/api/building') {
      const payload = JSON.stringify({
        buildingId: latestReading.buildingId,
        touchedAt: latestReading.touchedAt,
        sensorCode: latestReading.sensorCode,
      });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(payload);
      return;
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Not Found' }));
  });

  server.listen(port, host, () => {
    console.log(`[api] listening http://${host}:${port}`);
  });

  return server;
};

const createSocketServer = () => {
  const host = process.env.WS_HOST ?? '0.0.0.0';
  const port = Number(process.env.WS_PORT ?? 6060);
  const wss = new WebSocketServer({ host, port });
  console.log(`[ws] listening ws://${host}:${port}`);

  wss.on('connection', (ws, req) => {
    const remote = req.socket.remoteAddress;
    console.log('[ws] client connected:', remote);
    ws.send('hello from ws-server');

    ws.on('message', (data, isBinary) => {
      const payload = isBinary ? data.toString('utf8') : data.toString();
      console.log(`[ws] message from ${remote}:`, payload);
      const numeric = Number(payload);

      if (!updateLatestReading(numeric)) {
        console.warn(`[ws] ignored invalid sensor value: ${payload}`);
        return;
      }

      console.log(
        `[ws] sensorCode=${latestReading.sensorCode} -> buildingId=${latestReading.buildingId}`,
      );
    });
  });

  return wss;
};

const initSocket = () => {
  const apiServer = createHttpServer();
  const wss = createSocketServer();
  return { apiServer, wss };
};

if (import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  initSocket();
}

export { initSocket };
