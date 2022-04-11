const b = require('bcrypt');

const password = 'user123';

const hash = b.hashSync(password,10);

console.log(hash);