document.getElementById('btn_login').addEventListener('click', () => {
    const getValue = (id) => document.getElementById(id).value;

    getValue('username')
    fetch('/login', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({ username: getValue('username'), password: getValue('password') })
    })
        .then(res => res.text())
        .then(res => {
           // alert(res);
            if(res === 'adm')
                window.location.href = "http://localhost:8080/adm";
            else
                window.location.href = "http://localhost:8080/user";
        });
});