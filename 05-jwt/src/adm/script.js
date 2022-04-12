document.getElementById('btn_cadaster').addEventListener('click', () => {
    const getValue = (id) => document.getElementById(id).value;

    fetch('/cadasterUser', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({name: getValue('name'), username: getValue('username'), password: getValue('password')})
    })
});

const table = document.getElementById('table_id');
(async () => {
    (await (await fetch('/getUsers')).json()).forEach(elem => {
        table.innerHTML += `
            <tr>
                <td>${elem.name}</td>
                <td>${elem.username}</td>
                <td>${elem.userType}</td>
            </tr>
        `;
    });
})();