import WebsocketServer from './websocket';
import { app } from './express';

const wss = new WebsocketServer(9001);
const expressPort = 9002;
wss.start();
app.listen(expressPort,
  () => WebsocketServer.messageLog('start',
    `Express server start and listen on port ${expressPort}`));
