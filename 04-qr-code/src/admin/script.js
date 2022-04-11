const defaultServerLink = 'http://localhost:8080';
const btnRegisterUser = document.getElementById('registerUserBtn');
const btnRegisterParty = document.getElementById('registerPartyBtn');
const exitBtn = document.getElementById('logoutBtn');

exitBtn.addEventListener('click', logout);
btnRegisterUser.addEventListener('click', registerUser);
btnRegisterParty.addEventListener('click', registerParty);


async function checkCookie() {
    const cookie = await (await (fetch('/checkCookie'))).text();
    console.log(cookie);
    if (cookie === 'needLogin') {
        window.location.href = `${defaultServerLink}`;
    } 
}

checkCookie();

async function registerUser() {
    const fullname = document.getElementById('fullname').value;
    const login = document.getElementById('login').value;
    const pass = document.getElementById('pass').value;

    if (login && pass && fullname) {
        const registerTrial = await (await fetch(`${defaultServerLink}/registerUser`, {
            method: `POST`,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify([{ "fullname": fullname, "login": login, "password": pass }])
        })).json();
        console.log(registerTrial);
        
    }
};

async function registerParty() {
    const name = document.getElementById('partyName').value;
    const desc = document.getElementById('partyDescription').value;
    const partyDate = document.getElementById('partyDate').value;
    const partyTime = document.getElementById('partyTime').value;

    if (name && desc && partyDate && partyTime) {
        console.log("foi");
        const registerTrial = await (await fetch(`${defaultServerLink}/registerParty`, {
            method: `POST`,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify([{ "name": name, "description": desc, "date": partyDate, "time": partyTime }])
        })).json();
        console.log(registerTrial);
        
    } else {
        console.log('error');
    }
};

async function logout() {
    const exipresCookie = await (fetch(`${defaultServerLink}/logout`));
    console.log(exipresCookie);
    window.location.href = `${defaultServerLink}`;
    localStorage.clear();
}