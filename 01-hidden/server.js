const express = require('express');
const {randomBytes} = require('crypto');
const bodyParser = require('body-parser');
const app = express();
const port = 8080;
const users = [];

// app.use(express.urlencoded({extended: false}));
// app.use(express.json());

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

app.use('/', express.static('src/'));

app.post('/loginToken', ((req,res) =>{
    const login = req.body[0];
    console.log(req.body[0]);
    const token = randomBytes(512);
    // console.log(
    //   `${token.length} bytes of random data: ${token.toString('hex')}`);
    
    login["token"] = token.toString('hex');
    console.log(login);
    users.push(login);
    res.send(token.toString('hex'));
}))

app.get('/loggedToken', ((req,res) =>{
    const compareToken = req.query.token;
    let found = 'Not Found!';
    users.forEach(elem => {
        if (elem.token == compareToken){
            found = elem.login;
        }
    });
    res.send(found);
}))

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
  
