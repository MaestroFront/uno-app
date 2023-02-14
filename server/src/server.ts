import WebsocketServer from './websocket';
import { app } from './express';
import DBUno from './database';
import { DBUsers } from './game/types';
const wss = new WebsocketServer(9001);
wss.start();
app.listen(9002, ()=>console.log('Сервер запущен...'));
let res: DBUsers;
// (async () => res = await DBUno.checkUsersExist('Kirill'))();
// setTimeout(()=> console.log(res), 2000);
// DBUno.checkUsersExist('Kirill').then(data => {
//   if (typeof data !== 'undefined') {
//     console.log('yes');
//     console.log(data);
//   }
// });
