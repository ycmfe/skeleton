const maxage = 86400000;

module.exports = {
    port: 8016,
    logPath: './logs',
    secretKey: 'yccdn',
    cookie: {
        maxAge: maxage
    },
    api: {
        test: {
            upload: {
                url: 'http://10.8.8.112:3335'
            }
        }
    },
    db: {},
    locals: {}
};