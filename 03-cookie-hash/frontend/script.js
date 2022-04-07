const defaultServerLink = 'http://localhost:8080'

const loginBtn = document.getElementById('btnLogin');
const registerBtn = document.getElementById('btnRegister');
const logoutBtn = document.getElementById('btnLogout');

if (loginBtn) {
    loginBtn.addEventListener('click', loginCheck);
}
if (registerBtn) {
    registerBtn.addEventListener('click', register);
}
if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
}


// INDEX

async function checkCookie() {
    const cookie = await (await (fetch('/checkCookie'))).text();
    console.log(cookie);
    if (cookie === 'logged') {
        window.location.href = `${defaultServerLink}/logged.html`;
    }
}
if (loginBtn) {
    checkCookie();
}

async function loginCheck() {
    const login = document.getElementById('login').value;
    const pass = document.getElementById('loginPass').value;

    if (login && pass) {
        const loginTrial = await fetch(`${defaultServerLink}/userLogin`, {
            method: `POST`,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify([{ "login": login, "password": pass }])
        })
        await checkCookie();
    }
}



// LOGGED

async function logout() {
    const exipresCookie = await (fetch('/logout'));
    console.log(exipresCookie);
    window.location.href = `${defaultServerLink}`;
}





// REGISTER

async function register() {
    const login = document.getElementById('registerLogin').value;
    const pass = document.getElementById('registerPass').value;
    const pass2 = document.getElementById('registerPass2').value;

    if (pass === pass2) {
        if (login && pass && pass2) {
            const response1 = await fetch(`${defaultServerLink}/setCookiesRegister`, {
                method: `POST`,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify([{ "login": login, "password": pass }])
            })
            window.location.href = `${defaultServerLink}`;
        }
    }
}