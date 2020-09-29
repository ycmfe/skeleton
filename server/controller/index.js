const Router = require('express').Router;
const router = new Router();
// const auth = require('../../../filter/auth');
// router.use(auth);


router.get('/', (req, res) => {
    res.render('index')
})
module.exports = router;