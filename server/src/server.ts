import express from 'express';
const app = express();
const port = 5000;
const urlencodedParser = express.urlencoded({extended: false});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// app.get('/reg', (req, res) => {
//     res.send('registration');
// });

app.post("/registration", urlencodedParser, function (request, response) {
    if(!request.body) return response.sendStatus(400);
    console.log(request.body);
    response.send(`${request.body.userName} - ${request.body.userAge}`);
});

app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
