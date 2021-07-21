const router = require('express').Router();

//-----------redis--------------
const redis = require('./../model/RedisForArielReciver');
const redisGet = require('./../model/RedisGet');


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
    res.render("./pages/index",{card:cardData});
}));


redis.redisC.on("message", async function (channel, msg) {
    await redisGet.getRedisData.getNumberOfCars(sendSections);
});

function sendSections(data) {
    io.emit('new data', JSON.parse(data));
}


//------------ Socket.io ----------------
io.on("connection", (socket) => {
    console.log("new user connected on dashboard");
    socket.on("carList", async (msg) => {
        await redisGet.getRedisData.getSectionList(msg, sendToViewTheList);
    });
});

function sendToViewTheList(data) {
    if (data) {
        let arr = Object.keys(data);
        console.log("array size: " + arr.length);
        let newArr = [];
         arr.forEach((id) => {
            let car = {};
            let obj = JSON.parse(data[id]);
            car.carNumber = obj.carNumber;
            car.carType = obj.carType;
            newArr.push(car);
        });
        io.emit('updateList', newArr);
    } else {
        io.emit('updateList', []);
    }
}

module.exports = router;
