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