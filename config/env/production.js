const maxage = 86400000;
const Redis = require('ioredis');

module.exports = {
    port: 8016,
    logPath: './logs',
    secretKey: 'yangcong',
    cookie: {
        maxAge: maxage
    },
    db: {
    },
    locals: {}
};
