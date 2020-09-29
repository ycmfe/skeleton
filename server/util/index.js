const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const crypto = require('crypto');
const log4js = require('log4js');
const utilLog = log4js.getLogger('[ERROR_LOG]');

exports.df = require('./dateformat');
exports.param = require('./paramverify');
exports.numberUtil = require('./number');
/**
 * 简单的对象继承
 * @param old
 * @param n
 * @param state
 * @returns {*}
 */
exports.extend = function extend(old, n, state = false) {
    let newObj = {};
    for (var key in n) {
        old[key] = n[key];
    }
    if (state) {
        for (var key in old) {
            newObj[key] = old[key];
        }
        return newObj;
    }
    return old;
};
/**
 * 获取客户端真实ip
 * 这里有一个坑，会获取到2个ip，取其中一个即可
 * @param req
 * @returns {*}
 */
exports.clientIp = function clientIp(req) {
    let ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    return ip.split(',')[0];
}
/**
 * 获取真实ip
 * @param req
 * @returns {*}
 */
exports.realIp = function realIp(req) {
    return (req.headers['x-real-ip'] || '').split(',')[0];
}
/**
 * 是否存在于白名单
 * @param ip
 * @param whites
 * @returns {boolean}
 */
exports.isPrivateIp = function isPrivateIp(ip, whites) {
    return _.has(whites, ip);
};
/**
 * setCache
 * @type {Function}
 */
let setCache = exports.setCache = function (res, key, auth_token, options) {
    res.cookie(key, auth_token, options);
};

/**
 * 对象合并
 * @param defaults
 * @param ops
 * @returns {*|{}}
 */
exports.options = function options(defaults, ops) {
    defaults = defaults || {};
    ops = ops || {};
    Object.keys(ops).forEach((key) => {
        defaults[key] = ops[key];
    });
    return defaults;
};
/**
 * 空函数
 */
exports.noop = function noop() {
};
/**
 * 定时函数
 * @param fn
 * @param args
 */
exports.defer = function defer(fn, ...args) {
    process.nextTick(function () {
        fn.apply(null, args);
    });
};
/**
 * uuid
 * @param length
 * @returns {string}
 */
exports.uuid = function uuid(length = 32) {
    let str = crypto.randomBytes(Math.ceil(length * 0.75)).toString('base64').slice(0, length);
    return str.replace(/[\+\/]/g, '_');
};
/**
 * 文件权限
 * @param p
 * @param mode
 * @returns {*}
 */
const chmod = exports.chmod = (p, mode = '0777') => {
    if (!fs.existsSync(p)) {
        return true;
    }
    return fs.chmodSync(p, mode);
};
/**
 * 创建目录
 * @param p
 * @param mode
 * @returns {boolean}
 */
const mkdir = exports.mkdir = (p, mode = '0777') => {
    if (fs.existsSync(p)) {
        chmod(p, mode);
        return true;
    }
    let pp = path.dirname(p);
    if (fs.existsSync(pp)) {
        fs.mkdirSync(p, mode);
    } else {
        mkdir(pp, mode);
        mkdir(p, mode);
    }
    return true;
};
/**
 * md5
 * @param str
 * @returns {*}
 */
const md5 = exports.md5 = str => {
    let instance = crypto.createHash('md5');
    instance.update(str + '', 'utf8');
    return instance.digest('hex');
};
/**
 * copy
 * @param str
 * @returns {*}
 */
exports.copy = (obj) => {
    return JSON.parse(JSON.stringify(obj));
};

/**
 * 获取请求的唯一uid
 * @param req
 * @returns {*}
 */
exports.createRequestUid = function createRequestUid(req, res) {
    let rid = req.__datestamp || new Date().getTime();
    let ip = exports.realIp(req) || exports.clientIp(req);
    let referer = req.headers.referer || req.headers.referrer || '';
    let cookies = req['cookies'] || {};
    cookies = JSON.stringify(cookies);
    return md5(rid + ip + req.url + referer + cookies + req.method).substring(19);
};

exports.errorLog = function (req, config = {}) {
    let ip = req ? exports.clientIp(req) : 'ERROR_LOG';
    let key = req ? exports.createRequestUid(req) : 'ERROR_LOG';
    let url = req.url || 'ERROR_LOG';

    let name = config.name || '';
    let error = config.error || {};
    let errorMsg = error.stack + error.message || 'unknow error';
    config.error = errorMsg;
    let value = JSON.stringify(config);
    utilLog.info(`[${key}]`, `[${ip}]`, `[ERROR_LOG]`, `[${url}]`, `### ${name} error ${value}`);
};
/**
 * 记录日志
 * @param logger
 * @param options
 */
exports.recordLog = function recordLog(logger, options) {
    let key = exports.createRequestUid(options.req, options.res);
    let ip = exports.realIp(options.req) || exports.clientIp(options.req);
    let content = options.content;
    if (typeof options.content !== 'string') {
        let pwd;
        if (content.form) {
            pwd = content.form.pwd;
        }
        content = JSON.stringify(options.content);
        pwd && (content = content.replace(pwd, '*********'));
    }
    let other = options.other || '';
    // log info
    let logFn = logger.info;
    // error
    if (options.type === 'error') {
        logFn = logger.error;
    }
    // warn
    if (options.type === 'warn') {
        logFn = logger.warn;
    }
    let log;
    if (options.name) {
        log = `[${key}] [${ip}] [${options.url}] [${options.name}--${options.category}]|${options.req.originalUrl || ''}|${content}${other}`;
    } else {
        log = `[${key}] [${ip}] ${options.req.originalUrl || ''}|${content}${other}`;
    }


    logFn.call(logger, log);
};
let errorModal = require('./error');
/**
 * 返回错误
 * @param err
 */
exports.errorModal = function (err) {
    return _.clone(errorModal[err], true);
};
/**
 * 保留几位小数
 * @param str 字符或者数字
 * @param number 数字
 * */
exports.toFixed = (str, number = 4) => {
    let num = Number(str);
    if (!isNaN(num)) {
        let numStr = num.toFixed(number);
        if (numStr.indexOf('.0000') > -1) {
            numStr = numStr.split('.')[0];
        }
        return parseFloat(numStr);
    }
    return str;
};

/**
 * 获取排名
 * @param arrDate
 * @returns {boolean}
 */
exports.getRank = function (arr = [], cur = '') {
    arr.push(cur);
    arr.sort(function (a, b) {
        return b - a;
    });
    return arr.indexOf(cur) + 1;
};
/**
 *  通过键值获取数组中对应的项
 * @param arr 数组
 * @param config {key: '', val: ''}
 * @returns {}
 * */
exports.filterByKey = function (arr, config = {}) {
    config.key = config.key || 'key';
    config.val = config.val || 'value';

    let str = '';
    arr.forEach((item) => {
        for (let key in item) {
            if (key == config.key && item[key] == config.val) {
                str = item;
                return str;
            }
        }
    });
    return str;
};

/**
 * 将字符串转换为数组
 * @param str 字符或者数字
 * @param number 数字
 * */
exports.toArray = (str) => {
    let arr = [];
    str = JSON.parse(str);
    if (Object.prototype.toString.call(str) === '[object Array]') {
        return str;
    }
    if (Object.prototype.toString.call(str) === '[object Object]') {
        for (let key in str) {
            arr.push(parseInt(str[key]));
        }
        return arr;
    }
};
/**
 * 数组求和
 * @param str 字符或者数字
 * @param number 数字
 * */
exports.toSum = (arr = []) => {
    let sum = 0;
    if (arr.length > 0) {
        arr.forEach((item) => {
            if (Number(item)) {
                sum = util.numberUtil.add(sum, item);
            }
        })
    }
    return sum;
};
/**
 * 提取cookie
 * @param str 字符或者数字
 * @param number 数字
 * */
exports.getCookie = (str = '', key = '') => {
    let arr = str.split(';');
    let obj = {};
    arr.forEach((item) => {
        let cookieItem = item.split('=');
        let cookieKey = cookieItem[0].trim();
        obj[cookieKey] = cookieItem[1];
    });
    if (obj[key]) {
        return obj[key];
    }
    return '';
};
exports.quickSort = (arr, prop, sort) => {
    //如果数组<=1,则直接返回
    if (arr.length <= 1) {
        return arr;
    }
    let pivotIndex = Math.floor(arr.length / 2);
    //找基准，并把基准从原数组删除
    let pivot = arr.splice(pivotIndex, 1)[0];

    //定义左右数组
    let left = [];
    let right = [];
    let last = [];

    //比基准小的放在left，比基准大的放在right
    for (let i = 0; i < arr.length; i++) {
        if (arr[i][prop] !== '--' && arr[i][prop] != null) {
            if (sort == 2) {
                if (arr[i][prop] >= pivot[prop]) {
                    left.push(arr[i]);
                }
                else {
                    right.push(arr[i]);
                }
            } else {
                if (arr[i][prop] <= pivot[prop]) {
                    left.push(arr[i]);
                }
                else {
                    right.push(arr[i]);
                }
            }

        } else {
            last.push(arr[i]);
        }

    }
    if (pivot[prop] == '--') {
        return util.quickSort(left, prop, sort).concat(util.quickSort(right, prop, sort),[pivot], last);
    }
    //递归
    return util.quickSort(left, prop, sort).concat([pivot], util.quickSort(right, prop, sort), last);
};