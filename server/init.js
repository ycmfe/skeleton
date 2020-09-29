const path = require('path');
const util = require('./util');
global.util = util;
const request = require('./util/request');
global.request = request;

const db = require('./module/index');
global.db = db;
// express
const express = require('express');
const bodyParser = require('body-parser');
const favicon = require('static-favicon');
const csurf = require('csurf');
const session = require('express-session');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const ejs = require('ejs-mate');

const _ = require('lodash');
const glob = require('glob');
const helper = require('./helper/index');
const commonConf = require('../config/env/common');
// 生产环境的配置文件
const prodEnvList = ['production', 'test', 'uat', 'dev'];

const app = express();
global.prodEnvList = prodEnvList;
global.SERVER_ENV = app.get('env');
global.ROOT_PATH = path.join(__dirname, '..');
global.ENV_CONFIG = require(`../config/env/${SERVER_ENV}`);
global.commonConf = commonConf;
app.use((req, res, next) => {
    res.header('X-Powered-By', 'YCCDN');
    next();
});

app.set('views', path.join(ROOT_PATH, 'static/views'));
app.set('view engine', 'ejs');

// 日志
const log = require('./log/index');

app.use(express.static(path.join(ROOT_PATH, 'static/resource')));

// 静态压缩
app.use(compression());
// 限制上传50M
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: false, limit: '50mb'}));


// 生产环境启用缓存
if (prodEnvList.indexOf(SERVER_ENV) != -1) {
    app.set('view cache', true);
}
// 获取真实ip
app.enable('trust proxy');

// 模板中一些公共的变量
_.assign(app.locals, ENV_CONFIG.locals || {}, helper);
// 当前环境
app.locals.isProduction = prodEnvList.indexOf(SERVER_ENV) != -1;

// 设置cookie
app.use(cookieParser(ENV_CONFIG.secretKey));
// session 存到mysql中
const dbConfig = ENV_CONFIG.db;
// 是否设置sessionStore
if (dbConfig.store) {
    let sessionStore = null;
    try{
        sessionStore = dbConfig.store(session);
    }catch(err){
        console.log(err);
    }
    app.use(session({
        // 设置 cookie 中，保存 session 的字段名称，默认为 connect.sid
        name: 'yc',
        // 通过设置的 secret 字符串，来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改。
        secret: 'secret',
        // session 的存储方式，默认存放在内存中，也可以使用 redis，mongodb 等。Express 生态中都有相应模块的支持。
        store: sessionStore,
        // 设置存放 session id 的 cookie 的相关选项，默认为(default: { path: '/', httpOnly: true, secure: false, maxAge: null })
        // cookie: {
        //     maxAge: ENV_CONFIG.cookie.maxAge
        // },
        // 产生一个新的 session_id 时，所使用的函数， 默认使用 uid2 这个 npm 包。
        // genid: uid2,
        // 即使 session 没有被修改，也保存 session 值，默认为 true。
        resave: false,
        // rolling: 每个请求都重新设置一个 cookie，默认为 false。
        rolling: false,
        // 无论有没有session cookie，每次请求都设置个session cookie ，默认给个标示为 connect.sid
        saveUninitialized: false
    }));

}

//const faviconPath = path.resolve(__dirname, '../public/static/favicon.ico');
//app.use(favicon(faviconPath));


app.use(log.use());

// 公共的过滤信息
//const filter = require('./filter');
//app.use(filter.index);

// 路由生成
// 会根据文件名生成父级，如：
// user.js => /user/login

app.all('*', (req, res, next)=> {
    res.header("Content-Type", "text/html;charset=utf-8");
    next();
});


function createRouter(dirPath) {
    const routersDir = path.join(__dirname, dirPath);
    glob.sync(routersDir + '/**/*.js').forEach((file, index) => {
        let dirname = path.dirname(file).split(path.sep);
        dirname = dirname.pop();
        dirname = dirname == dirPath ? '' : `/${dirname}`;
        let name = path.basename(file, '.js');
        name = `/${name}`;
        const relativePath = file;
        if (!dirname && !name) {
            name = '/index';
        }
        let rPath = `${dirname}${name}`;
        if (dirPath === 'api') {
            let apiPath = file.replace(__dirname, '');
            rPath = apiPath.replace(/\.js/, '');
        }
        app.use(rPath, require(relativePath));
    });
}
app.use('/', require('./controller/index.js'));
createRouter('api');

if (prodEnvList.indexOf(SERVER_ENV) != -1) {
    app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

// Handle 500
    app.use(function (error, req, res, next) {
        res.status(500);
        //res.render('500.html', {title: '500', error: error});
    });
}

module.exports = app;
