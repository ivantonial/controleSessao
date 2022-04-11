const router = require("express").Router();
const bcrypt = require('bcrypt');
const { createHash } = require('crypto');
const qrCode = require('qrcode-generator');

let users = [{ "name": "Ivan Ramalho Tonial", "login": "ivantonial", "password": "$2b$10$vE69sxRirIDqFqTjSgCEtuNKtGkHW5vVBONfITAmdmv.i1OsNTXBa", "parties": [{ "name": "haha", "description": "haha", "date": "2022-02-21", "time": "10:00" }] }];
let admin = [{ "name": "Ivan Ramalho Tonial", "login": "admin", "password": "$2b$10$1nYhLmUP3Ys.sL52LcswYu7g11OYmObwYIerQG.T7WQgeUfQydqMW" }];
let parties = [{ "name": "haha", "description": "haha", "date": "2022-02-21", "time": "10:00" }, { "name": "hehe", "description": "haha", "date": "2022-02-21", "time": "10:00" }];

router.post("/loginPage", (req, res) => {
    console.log(req.body);
    const user = req.body[0];
    console.log(user);
    let userName;
    let foundAdmin = false;
    let foundPass = false;
    let foundUser = false;

    admin.forEach((elem) => {
        // console.log("elem: " + elem.login);
        // console.log("admin: " + user.login);
        if (elem.login === user.login) {
            foundAdmin = true;

            if (bcrypt.compareSync(user.password, elem.password)) {
                foundPass = true;
                res.cookie(`userAccess`, `${elem.password}`, {
                    maxAge: 1000000,
                    secure: true,
                    httpOnly: true,
                    sameSite: 'lax'
                }
                );
            }
        } else if (users) {
            users.forEach((elem) => {
                if (elem.login === user.login) {
                    foundUser = true;
                    if (bcrypt.compareSync(user.password, elem.password)) {
                        foundPass = true;
                        userName = elem.name;
                        console.log(userName);
                        res.cookie(`userAccess`, `${elem.password}`, {
                            maxAge: 1000000,
                            secure: true,
                            httpOnly: true,
                            sameSite: 'lax'
                        }
                        );
                    }
                }
            })
        }
    });
    console.log(userName);
    console.log(foundAdmin);
    console.log(foundPass);
    if (foundAdmin && foundPass) {
        return res.json({ 'message': 'CadastradoAdmin' });
    } else if (foundUser && foundPass) {
        return res.json({ 'message': 'CadastroUser', 'user': userName, 'login': user.login });
    } else {
        return res.json({ 'message': 'Dados Incorretos!' });
    }
})

router.post("/registerUser", (req, res) => {
    const info = req.body[0];
    let foundLogin = false;
    let message = "Usuário já cadastrado!";

    users.forEach((elem) => {
        if (elem.login === info.login) {
            foundLogin = true;
        }
    })

    if (!foundLogin) {
        console.log(info.password);
        info.password = bcrypt.hashSync(info.password, 10);
        console.log(info.password);
        users.push(info);
        console.log(users);
        message = info;
    }

    res.json(message);

})

router.post("/registerParty", (req, res) => {
    const info = req.body[0];
    let foundParty = false;
    let message = "Festa já cadastrada";

    console.log(info.date);

    parties.forEach((elem) => {
        if (elem.name === info.name && elem.date === info.date) {
            foundParty = true;
        }
    })

    if (!foundParty) {
        parties.push(info);
        console.log(parties);
        message = info;
    }

    res.json(message);

})

router.get("/partiesToRegister", (req, res) => {
    const userLogin = req.query.login;
    const partiesToRegister = [...parties];
    const userParties = users.find(elem => elem.login === userLogin);

    if (parties) {
        if (userParties.parties[0]) {
            userParties.parties.forEach((elem1) => {
                partiesToRegister.forEach((elem2) => {
                    if (elem2.name === elem1.name && elem2.date === elem1.date) {
                        const indice = partiesToRegister.indexOf(elem2,0);
                        partiesToRegister.splice(indice ,1);
                    }
                })
            })
        }
        return res.json(partiesToRegister);
    } else {
        return res.send('NENHUMA FESTA DISPONÍVEL!');
    }
})

router.get("/partiesToGo", (req, res) => {
    const userLogin = req.query.login;
    const partiesToGo = [];
    const userParties = users.find(elem => elem.login === userLogin);

    if (parties) {
        if (userParties.parties[0]) {
            userParties.parties.forEach((elem1) => {
                parties.forEach((elem2) => {

                    if (elem2.name === elem1.name && elem2.date === elem1.date) {
                        partiesToGo.push(elem2);
                    }
                })
            })
        }
        return res.json(partiesToGo);
    } else {
        return res.send('NENHUMA FESTA DISPONÍVEL!');
    }
})

router.post("/partyThis", (req, res) => {
    const info = req.body[0];
    let foundParty = false;
    let message = "Festa já cadastrada";
    let party;
    let alreadyRegistered = false;
    console.log(info.date);

    users.forEach((elem1) => {
        if (info.login === elem1.login) {
            elem1.parties.forEach((elem2) => {
                if (elem2.name === info.name && elem2.date === info.date) {
                    alreadyRegistered = true;
                }
            })
        }
    })
    parties.forEach((elem) => {
        if (!alreadyRegistered && elem.name === info.name && elem.date === info.date) {
            foundParty = true;
            party = elem;
        }
    })

    if (foundParty) {
        users.forEach(elem => {
            if (elem.login === info.login) {
                elem.parties.push(party);
                console.log("aqui");
                console.log(elem);
            }
        })

        message = party;
    }

    res.json(message);

})

router.post("/qrCodeGenerator", (req, res) => {
    const info = req.body[0];
    console.log(info);
    const nameInfo = info.name;
    const dateInfo = info.date;
    const teste = info.name + info.date;
    console.log("INFOOOOOOOOOOO:" + Object.values(info));
    const token = createHash('sha256').update(teste).digest('hex');
    console.log("TOKEN: " + token);
        const qr = qrCode(10, 'L');
        qr.addData('http://localhost:8080/confirm?token='+token);
        qr.make();
        res.send(qr.createImgTag())
    
})

router.get('/logout', ((req, res) => {
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


router.get('/checkCookie', ((req, res) => {
    console.log(req.cookies.userAccess);
    if (req.cookies.userAccess) {
        console.log('haha')
        return res.send('logged');
    } else {
        console.log('huhu');
        return res.send('needLogin');
    }
}))

module.exports = router;