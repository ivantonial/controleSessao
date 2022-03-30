const sendBtn = document.getElementById('btnLoginRequest');
const accessBtn = document.getElementById('btn-access');
const defaultServerLink = 'http://localhost:8080';

sendBtn.addEventListener('click', token);
accessBtn.addEventListener('click', access);

async function token(){
    const login = document.getElementById('login').value;
    const pass = document.getElementById('pass').value;

    const response1 = await fetch(`${defaultServerLink}/loginToken`, {
        method:`POST`,
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
    document.getElementById('loginPlace').style.visibility = 'hidden';
    document.getElementById('logged').style.visibility = 'visible';
    // document.getElementById('welcomeMessage').innerText =  `Bem-Vindo, ${login}!`
};

async function access(){
    const token = document.getElementById('loginToken').value;

    const logged = await (await fetch(`/loggedToken?token=${token}`)).text();
    const welcome = document.getElementById('welcomeMessage');
    welcome.innerText = `Bem-Vindo, ${logged}!`;
    welcome.style.visibility = 'visible';
    document.getElementById('logged').style.visibility = 'hidden';
}
