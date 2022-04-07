const cookieBtn = document.getElementById('btnCookie');
const accessCookieBtn = document.getElementById('btn-access-cookie');
const logoutBtn = document.getElementById('btnLogout');
const defaultServerLink = 'http://localhost:8080';

cookieBtn.addEventListener('click', setCookies);
// accessCookieBtn.addEventListener('click', accessCookie);
// logoutBtn.addEventListener('click', deleteCookie);

async function checkCookie() {
    const logged = await (await fetch(`/checkCookies`)).text();
    console.log(logged);
    console.log('hahahahaha');
    if (logged !== 'Not Found!') {
        console.log('hahahahaha');
        await fetch(`/redirectLogged`);
        const welcome = document.getElementById('welcome');
        const welcomeMessage = document.getElementById('welcomeMessage');
        welcomeMessage.innerText = `Bem-Vindo, ${logged}!`;
        welcome.style.display = 'block';
        document.getElementById('logged').style.display = 'none';
    }
}

checkCookie();

async function setCookies() {
    const login = document.getElementById('login').value;
    const pass = document.getElementById('pass').value;

    if (login && pass) {
        const response1 = await fetch(`${defaultServerLink}/setCookies`, {
            method: `POST`,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify([{ "login": login, "password": pass }])
        })
        const response2 = (await response1.text());
        console.log(response2);
        const loginToken = document.getElementById('loginToken');
        loginToken.value = response2;
        document.getElementById('loginPlace').style.display = 'none';
        document.getElementById('logged').style.display = 'block';
        // document.getElementById('welcomeMessage').innerText =  `Bem-Vindo, ${login}!`
    }
};

async function accessCookie() {
    const token = document.getElementById('loginToken').value;

    const logged = await (await fetch(`/getCookies?token=${token}`)).text();
    const welcome = document.getElementById('welcome');
    const welcomeMessage = document.getElementById('welcomeMessage');
    welcomeMessage.innerText = `Bem-Vindo, ${logged}!`;
    welcome.style.display = 'block';
    document.getElementById('logged').style.display = 'none';
}

async function deleteCookie() {
    const token = document.getElementById('loginToken').value;

    const logged = await (await fetch(`/getCookies?token=${token}`)).text();
    const welcome = document.getElementById('welcome');
    const welcomeMessage = document.getElementById('welcomeMessage');
    welcomeMessage.innerText = `Bem-Vindo, ${logged}!`;
    welcome.style.display = 'block';
    document.getElementById('logged').style.display = 'none';
}

