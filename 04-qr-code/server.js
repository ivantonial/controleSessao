const express = require('express');
const port = 8080;
const ip = 'localhost:';
const app = express();
const routes = require("./routes/routes");
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());

app.use("/", routes);


// const password = 'admin123';

// const hash = bcrypt.hashSync(password,10);

// console.log(hash);

app.use(express.static('./src'));




module.exports

app.listen(port, err => {
    if(err){
        console.log("There was a problem", err);
        return;
    }
    console.log(`Working on http://${ip}${port}`);
})

