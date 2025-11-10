import { WebSocketServer } from 'ws';

const initSocket = () => {
  const host = process.env.WS_HOST ?? '0.0.0.0';
  const port = Number(process.env.WS_PORT ?? 8080);
  const wss = new WebSocketServer({ host, port });
  console.log(`WS listening ws://${host}:${port}`);
  wss.on('connection', (ws, req) => {
    console.log('client:', req.socket.remoteAddress);
    ws.send('hello from ws-server');
  });
  return wss;
};

if (import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  initSocket();
}

export { initSocket };
