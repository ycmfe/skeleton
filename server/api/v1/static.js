const Router = require('express').Router;
const router = new Router();
const { get, post } = require('../../module/cdn');

router.get('/', (req, res) => {
    const { type } = req.query;
    const _type = (type === 'map' || type == 1 || !type ) ? 1 : 2;
    get({type: _type}).then((ret) => {
        if(type === 'map'){
            let data = [];
            const first = [];
            ret.forEach(item => {
                if(item.sort >= 1){
                    return first.push({
                        url: item.url,
                        sort: item.sort
                    })
                }
                data.push({
                    url: item.url,
                    sort: item.sort
                });
            });

            data = first.concat(data);

            res.json({"status":{"code":200,"msg":"OK"}, data});
            return 
        }
        res.json({"status":{"code":200,"msg":"OK"}, data: ret});
    })
})
module.exports = router;