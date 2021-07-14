const router = require('express').Router();

//-----------redis--------------


router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

router.route('/').get(((req, res) => {
    const cardData = {
        id: "totalSum",
        title: "אריאל",
        totalSum: 5,
        percent: 0.8,
        icon: "work"
    };
    const cards = ["Borrowed", "Annual Profit", "Lead Conversion", "Average Income",];
    res.render("./pages/index",{card:cardData});
}));

module.exports = router;
