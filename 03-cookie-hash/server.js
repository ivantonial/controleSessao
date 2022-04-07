const express = require('express');
const { randomBytes } = require('crypto');
const { createHash } = require('crypto');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { addAbortSignal } = require('stream');
const app = express();
const port = 8080;
const users = [];


// app.use(express.urlencoded({extended: false}));
// app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(cookieParser());

app.use('/', express.static('frontend/'));



// INDEX

app.get('/checkCookie', ((req, res) => {
    console.log(req.cookies.userAccess);
    if (req.cookies.userAccess) {
        console.log('haha')
        return res.send('logged');
    } else {
        console.log('huhu');
        return res.send('needLogin');
    }
}))

app.post('/userLogin', (async (req, res) => {
    console.log(req.body);
    const user = req.body[0];
    console.log(user);
    let found = false;

    users.forEach((elem) => {
        if (elem.login === user.login && elem.password === user.password) {
            found = elem.token;
        }
    })
    console.log(found);
    if (found) {
        const hash = createHash('sha256');
        hash.update(user.password);
        const hashToken = await(bcrypt.hash(hash.digest('hex'), 10));

        user["token"] = hashToken.toString('hex');
        // console.log(login);

        found = hashToken.toString('hex');
        res.cookie(`userAccess`, `${hashToken}`
            , {
                maxAge: 1000000,
                secure: true,
                httpOnly: true,
                sameSite: 'lax'
            }
        );
        return res.send('Cadastrado');
    } else {
        return res.send('Dados Incorretos!');
    }
}))

// LOGGED

app.get('/logout', ((req, res) => {
    const cookie = req.cookies.userAccess;
    console.log(cookie);
    res.cookie('userAccess', cookie, {
        maxAge: 0,
        expires: 'Thu, 01 Jan 1970 00:00:00 GMT',
        secure: true,
        httpOnly: true,
        sameSite: 'lax'
    });
    res.send('logout!');
}))

// REGISTER

app.post('/setCookiesRegister', (async (req, res) => {
    const hash = createHash('sha256');
    // console.log(req.body)
    const user = req.body[0];
    // console.log(req.body[0]);
    console.log(user.login);
    // const token = randomBytes(8);
    hash.update(user.password);
    const hashToken = await (bcrypt.hash(hash.digest('hex'), 10));
    let userStatus = false;
    users.forEach((elem) => {
        if (elem.login === user.login) {
            userStatus = true;
        }
    });

    if (userStatus) {
        return res.send('Já registrado');
    } else {
        user["token"] = hashToken.toString('hex');
        // console.log(login);
        users.push(user);

        res.cookie(`userAccess`, `${hashToken}`
            , {
                maxAge: 1000000,
                secure: true,
                httpOnly: true,
                sameSite: 'lax'
            }
        );
        return res.send('Cadastrado');
    }
}))



app.listen(port, () => console.log(`Example app listening on port ${port}!`));