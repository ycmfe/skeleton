const path = require('path');

module.exports = function (logdir, debug) {
    return {
        appenders: [
            { type: 'console' },
            {
                type: 'dateFile',
                "filename": path.join(logdir, 'access.log'),
                "pattern": ".yyyyMMdd",
                "alwaysIncludePattern": true
            }
        ],
        replaceConsole: true
    };
};