const defaultServerLink = 'http://localhost:8080';

const exitBtn = document.getElementById('logoutBtn');

exitBtn.addEventListener('click', logout);


document.getElementById('userName').innerText = "Bem-vindo, " + localStorage.getItem("userName") + "!";

const userLogin = localStorage.getItem("userLogin");


async function checkCookie() {
    const cookie = await (await (fetch('/checkCookie'))).text();
    console.log(cookie);
    if (cookie === 'needLogin') {
        window.location.href = `${defaultServerLink}`;
    } 
}

checkCookie();


async function partiesToRegister() {
    const parties = await (await (await fetch(`${defaultServerLink}/partiesToRegister?login=${userLogin}`)).json())
    const addParties = document.getElementById('pariesToRegister');
    addParties.innerHTML = "";
    let i = 1;
    if (parties[0]) {
        parties.forEach((elem) => {
            addParties.innerHTML += `
        <div id="partyToRegister${i}" class="partyThis">
            <h4>Nome: ${elem.name}</h4>
            <p>Data: ${elem.date}</p>
            <p>Hora: ${elem.time}</p>
            <p>Descrição: ${elem.description}</p>
            <div class="options">
                <input type:"button" id="btn${i}" class="partyThisBtn" onclick="partyThis('${elem.name}','${elem.date}')" value="PARTICIPAR!" />
            </div>
        </div>`;
            i++;
        });
    } else {
        addParties.innerHTML += `<h4>NENHUMA FESTA DISPONÍVEL!</h4>`
    }
}

partiesToRegister();

async function partiesToGo() {
    const parties = await (await (await fetch(`${defaultServerLink}/partiesToGo?login=${userLogin}`)).json())
    const addParties = document.getElementById('partiesToGo');
    addParties.innerHTML = "";
    let i = 1;
    if (parties[0]) {
        parties.forEach(async (elem) => {
            console.log("ELEM : " + Object.entries(elem));

            const qrCodeImg = await(await(fetch(`${defaultServerLink}/qrCodeGenerator`, {
                method: `POST`,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify([{"nome": elem.name, "date": elem.date}])
            }))).text();

            console.log("qrCode:" + qrCodeImg);

            addParties.innerHTML += `
        <div id="partiesToGo${i}" class="partyThis">
            <h4>Nome: ${elem.name}</h4>
            <p>Data: ${elem.date}</p>
            <p>Hora: ${elem.time}</p>
            <p>Descrição: ${elem.description}</p>
            <div class="options">
                ${qrCodeImg}
            </div>
        </div>`;
            i++;
        });
    } else {
        addParties.innerHTML += `<h4>NENHUMA FESTA DISPONÍVEL!</h4>`
    }
}

partiesToGo();

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

async function partyThis(_partyName, _partyDate) {
    const partyName = _partyName;
    const partyDate = _partyDate;

    const registerTrial = await (await fetch(`${defaultServerLink}/partyThis`, {
        method: `POST`,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify([{ "name": partyName, "date": partyDate, "login": userLogin }])
    })).json();
    console.log(registerTrial);
    partiesToRegister();
    partiesToGo();
}

async function logout() {
    const exipresCookie = await (fetch(`${defaultServerLink}/logout`));
    console.log(exipresCookie);
    window.location.href = `${defaultServerLink}`;
    localStorage.clear();
}