const Router = require('express').Router;
const router = new Router();
const awesomeSkeleton = require('../../awesome-skeleton/src/index.js');
// const awesomeSkeleton = require('awesome-skeleton');

router.get('/', async(req, res) => {
    let { url, name, device, cookies, grayblockwidth, graypseudowidth } = req.query;
    url = decodeURIComponent(url)
    console.log('param:%j', { url, name, device, cookies, grayblockwidth, graypseudowidth })
    try{
      const result = await awesomeSkeleton({
        debug: false,
        "pageName": name,
        "pageUrl": url,
        "openRepeatList": false,
        "device": device || "iPhone X",
        "minGrayBlockWidth": grayblockwidth || 80,
        "minGrayPseudoWidth": graypseudowidth || 10,
        "debug": true,
        "debugTime": 3000,
        "cookies": cookies
      })
      console.log('result:%j:%j', { url, name, device, cookies, grayblockwidth, graypseudowidth }, result)
      res.json({"status":{"code":200,"msg":"OK"}, data: result});

    } catch(err){
      console.log(err.message)
      console.log(err)
      res.json({"status":{"code":500,"msg":"OK"}, msg: err.message});
    }
    
})
module.exports = router;