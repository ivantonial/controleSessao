const express = require('express');
const app = express();
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const {createHash} = require('crypto');

const hash = createHash('sha256');
const users = [];

app.use(cookieParser());
app.use(express.urlencoded({extended: false}));

app.get('/', async (req, res) => {
    hash.update(users[0].name);
    const hashed = await bcrypt.hash(hash.digest('hex'), 10);
    res.sendFile(__dirname + '/frontend/index.html');
    res.cookie("username", hashed,{
        maxAge: 50000,
        secure: true,
        httpOnly: true,
        sameSite: 'lax'
    });
    
})

app.get('/login', function(req,res) {
    res.sendFile(__dirname + '/frontend/login.html');
})

app.post('/login', function (req, res) {

        if((req.body.email == users[0].email) && (req.body.password == users[0].password)) {
            res.redirect('/')
        } else {
            console.log("email/senha incorretos")
            res.redirect('/login')
        }
    
})

app.get('/register', function(req,res) {
    res.sendFile(__dirname + '/frontend/register.html');
})

app.post('/register', async (req, res) => {
    try {
        users.push({
            token: await bcrypt.hash(Date.now().toString(), 10),
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        })
        res.redirect('/login')
    } catch {
        res.redirect('/register')
    }
    console.log(users)
})

app.post('/logout', function (req, res) {
    res.clearCookie()
    res.redirect('/login')
})


app.listen(8080);