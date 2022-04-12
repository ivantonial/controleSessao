const express = require('express');
const jwt = require('jsonwebtoken');
const cookie = require('cookie-parser');

const app = express();
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookie());

app.use('/', express.static("./src/login/"));
app.use('/adm', express.static("./src/adm/"));
app.use('/user', express.static("./src/user/"));



const users = [
    {'name' : "Ivan Ramalho Tonial", 'username': "ivantonial", 'password': "admin123", 'userType': "adm"}
];

const privateKey = "abobrinhaAmaBeterraba";


app.post('/cadasterUser', (req, res) => {
    const userReq = req.cookies.jwt;
    if(jwt.verify(userReq, privateKey).userType === "adm"){
        const { name, username, password } = req.body;
        users.push(({"name": name, "username": username, "password": password, "userType":'user'}));
        res.send('Cadastrado')
    }else
        res.send('error');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log(req.body)
    const currentUser = users.find(elem => elem.username === username && elem.password === password);
    console.log(currentUser)
    if(currentUser){
        res.cookie('jwt', jwt.sign(currentUser, privateKey));
        res.send(currentUser.userType);
    }else
        res.send('algo deu errado');
});

app.get('/getUsers', (req, res) => {
    const user = req.cookies.jwt;
    const currentUser = users.find(elem => elem.username === jwt.verify(user, privateKey).username);
    if(currentUser)
        res.json(users);
    else   
        res.json({"err": "Error"});
});

app.listen(8080);