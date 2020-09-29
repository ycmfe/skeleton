/**
 * 日期相关
 * @type {{getNow}}
 */
const date = exports.date = {
    getNow(){
        return new Date().getTime();
    },
    getNowSec() {
        return Math.round(new Date().getTime()/1000)
    }
}

/**
 * 是否开启相对应模块
 * @param config = {id, hotel}
 * @return {status}
 * */
exports.isOn = (config = {}) => {
    let allModule = JSON.parse(config.hotel.FunctionModule) || {};
    let module = allModule[config.id] || {};
    let status = true;
    if(module.Status != 1 || module.EndTime < date.getNowSec()) {
        status = false;
    }

    return status;
};