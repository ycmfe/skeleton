const app = require('./init');

const server = app.listen(ENV_CONFIG.port, function () {
    console.debug(`Server running http://${ENV_CONFIG.port}`);
});