const router = require('express').Router();

//-----------redis--------------
const redis = require('./../model/RedisForArielReciver');


router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

router.route('/').get(((req, res) => {
    const cardData = {
        id: "totalSum",
        title: "Number of cars in the road",
        totalSum: 5,
        percent: 0.8,
        icon: "work"
    };
    const cards = ["Borrowed", "Annual Profit", "Lead Conversion", "Average Income",];
    res.render("./pages/newDash",{card:cardData});
}));


redis.redisC.on("message", function (channel, msg) {
    io.emit('new data', msg);
    // redis.NumOfCars(send);
    // io.emit('new data', redis.NumOfCars());
    // TODO with WS render the page to update the number of cars
});


module.exports = router;
