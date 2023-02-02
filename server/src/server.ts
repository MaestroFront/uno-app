import express from 'express';
import './chat';
import './database';

const app = express();
const port = 5000;
const urlencodedParser = express.urlencoded({ extended: false });
// app.get('/', (req, res) => {
//     res.send(`main page`);
// });

app.get('/', (req, res) => {
  res.send('main page');
});

app.get('/registration', (req, res) => {
  res.send('    <h1>Введите данные</h1>\n    <form method="post">\n        <label>Имя</label><br>\n        <input type="text" name="userName" /><br><br>\n        <label>Возраст</label><br>\n        <input type="number" name="userAge" /><br><br>\n        <input type="submit" value="Отправить" />\n    </form>');
});

app.post('/registration', urlencodedParser, function (request, response) {
  if (!request.body) return response.sendStatus(400);
  console.log(`${request.body.userName} - ${request.body.userAge}`);
  response.send(`${request.body.userName} - ${request.body.userAge}`);
});
if (require.main === module) {
  app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
  });
}
export default app;
