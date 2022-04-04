const express = require('express');
const {randomBytes} = require('crypto');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const e = require('express');
const { cp } = require('fs');
const app = express();
const port = 8080;
const users = [];

// app.use(express.urlencoded({extended: false}));
// app.use(express.json());

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

app.use(cookieParser());

app.use('/', express.static('src/'));

app.post('/setCookies', ((req,res) =>{
    console.log(req.body)
    const login = req.body[0];
    console.log(req.body[0]);
    const token = randomBytes(8);
    // Set-Cookie: key=token.toString('hex');
    // console.log(
    //   `${token.length} bytes of random data: ${token.toString('hex')}`);
    
    login["token"] = token.toString('hex');
    console.log(login);
    users.push(login);
    //console.log(login);
    res.cookie(`userAccess`, `${token.toString('hex')}`);
    res.send(token.toString('hex'));
}))

app.get('/getCookies', ((req,res) =>{
    const compareCookies = req.cookies.userAccess;
    console.log(compareCookies);
    let found = 'Not Found!';
    users.forEach(elem => {
        console.log("compareCookies: " + compareCookies);
        console.log("elemtoken: " + elem.token);
        if (elem.token == compareCookies){
            found = elem.login;
        }
    })
    res.send(found);
}))

app.post('/loginToken', ((req,res) =>{
    console.log(req.body);
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
  
