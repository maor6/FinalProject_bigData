const router = require('express').Router();



router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

router.route('/').get(((req, res) => {
    res.render('./pages/predictTable');
}));


module.exports = router;
