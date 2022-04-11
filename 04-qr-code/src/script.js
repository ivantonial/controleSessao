const defaultServerLink = 'http://localhost:8080';
const btnConnect = document.getElementById('connectBtn');

btnConnect.addEventListener('click', login);

async function login() {
    const login = document.getElementById('login').value;
    const pass = document.getElementById('pass').value;

    if (login && pass) {
        const loginTrial = await (await fetch(`${defaultServerLink}/loginPage`, {
            method: `POST`,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify([{ "login": login, "password": pass }])
        })).json();
        console.log(loginTrial);
        if(loginTrial.message === 'CadastradoAdmin'){
            window.location.href = 'http://localhost:8080/admin';
        } else if (loginTrial.message === 'CadastroUser') {
            localStorage.setItem("userName", loginTrial.user);
            localStorage.setItem("userLogin", loginTrial.login);
            window.location.href = 'http://localhost:8080/user';
        }
    }
};