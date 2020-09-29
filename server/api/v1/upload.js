const request = require('../../util/request');
const path = require('path');
const fs = require('fs');
const {exec, execSync} = require('child_process');
const qiniu = require('qiniu');
const Router = require('express').Router;
const router = new Router();
const formidable = require('formidable');
const { get, post } = require('../../module/cdn');
const uploadDir = path.join(ROOT_PATH, 'tmp');
const priority = [
    'vue', 'core-js', 'react','swiper','axios', 'YCWebViewBridge', 
    'onion-utils'
]

router.get('/', (req, res) => {
    request(req,res)({
        type: 'get',
        api: 'upload',
        url: '/api/qiniu/uploadToken',
        data: {
            bucket: 'onion-fp',
            expires: 3600
        }
    }).then((ret) => {
        res.json(ret);
    })
})
.post('/', (req, res) => {
    const { type } = req.body;
    const form = formidable({ multiples: true });
    const _uploadDir = path.join(uploadDir, `/${new Date().getTime()}`);
    if (!fs.existsSync(_uploadDir)) {
        execSync(`mkdir -p ${_uploadDir}`);
    }
    form.keepExtensions = true;
    form.uploadDir = _uploadDir; //文件保存的临时目录为当前项目下的tmp文件夹
    form.parse(req, async (err, fields, files) => {
        if (err) {
            res.json({code: 500, msg: err});
            return;
        }
        const fileJson = files.file.toJSON();

        const readableStream = fs.createReadStream(fileJson.path); // 可读的流
        const filename = `middle/${fields.version}/${fileJson.name}`;
        const name = path.basename(filename)
        const staticData = await get({
            version: fields.version,
            name
        });
        if(staticData.length){
            return res.json({code: 500, msg: `文件:${name} 版本:${fields.version} 已存在`});
        }

        const config = new qiniu.conf.Config();
        const formUploader = new qiniu.form_up.FormUploader(config);
        const putExtra = new qiniu.form_up.PutExtra();
        
        console.log('update:REQ:%j:%j:%s', fileJson, fields, filename);
        formUploader.putStream(fields.token, filename, readableStream, putExtra, (respErr, respBody, respInfo) => {
            exec(`rm -f ${fileJson.path}`);
            if (respErr) {
                res.json({msg: respErr});
                return;
            }
            if(!respBody.key){
                return res.json({code: 500, data: respBody});
            }
            let name = path.basename(filename)
            name = name.split('.')[0];
            const url = `https://fp.yangcong345.com/${filename}`;
            const extname = path.extname(url).replace('.', '')

            return post({
                name,
                url,
                type: fields.type,
                sort: priority.indexOf(name) !== -1 ? 1 : 0,
                category: extname,
                version: fields.version
            }).then(() => {
                res.json({code: 200, data: respBody});
            })
            .catch((err) => res.json({code: 500, data: err}))

        });
    });
    
})
module.exports = router;