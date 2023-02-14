import express from 'express';
import bodyParser from 'body-parser';
import DBUno from './database';
export const app = express();

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(bodyParser.json());

app.post('/registration', (req, res)=>{
  console.log(req.body);
  res.send((req.body));
});

app.post('/login', (req, res)=>{
  // console.log(req.body);
  // res.send((req.body));
  DBUno.checkUsersExist(req.body.userName).then(data => {
    if (typeof data !== 'undefined') {
      console.log('yes');
      console.log(data);
    } else {
      console.log('no');
    }
  });
});
