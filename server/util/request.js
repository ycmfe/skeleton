const request = require('request');
const log4js = require('log4js');
const logger = log4js.getLogger('[API]');
/**
 * request()(req, {}).then();
 *
 * 后端接口
 *
 * @returns {Function}
 */
module.exports = function (req, res) {
    return (options)=> {
        let ip = util.realIp(req) || util.clientIp(req);

        // data
        options.data = options.data || {};

        const method = (options.type || 'POST').toUpperCase();


        let  db_env = prodEnvList.indexOf(SERVER_ENV) === -1 ? 'test' : SERVER_ENV;

        let apiConfig = ENV_CONFIG.api[db_env][options.api];
        options.headers = util.extend(options.headers || {}, apiConfig.data || {});

        let url = (apiConfig.url || '') + options.url;
        let j = request.jar();
        // 参数配置
        let param = {
            method: method,
            uri: url,
            //useQuerystring: true,
            // 忽略证书
            strictSSL: false,
            jar: j
        };


        if(options.timeout){
            param.timeout = options.timeout * 1000;
        }

        // get请求时，走querystring
        if(method === 'GET'){
            param.qs = options.data;
        } else {

            if (options.isBodyData) {
                param.json = options.data;
            } else {
                param.form = options.data;
            }

        }
        // header
        param.headers = {
            'client-ip': ip,
            'User-Agent': req.userAgent
        };
        param.headers = util.extend(param.headers, options.headers || {});
        console.log('request:OPTIONS:%j', param);

        return new Promise((resolve, reject) => {

            request(param, (err, request, body) => {
                // 错误记录
                if (err) {
                    console.log('request:ERROR:%j:%j', param, {msg: JSON.stringify(err)});
                    resolve(util.errorModal('ERR_SYSTEM_ERROR'));
                    return 
                }

                let data = body;
                try {
                    data = typeof data === 'string' ? JSON.parse(data) : data;
                } catch (err) {
                    console.log('request:RES:%j:%j', param, {msg: err.message, data});
                    resolve(util.errorModal('ERR_SYSTEM_ERROR'));
                    data = null;
                    return;
                }
                // 兼容2套不同的api
                let returnData = {
                    "status": {
                        "code": 200,
                        "msg": "OK"
                    },
                    "data": data
                };
                
                console.log('request:RES:%j:%j', param, data);
                resolve(returnData);
            });
        });

    }
}