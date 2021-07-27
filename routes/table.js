const router = require('express').Router();


//-----------bigML--------------
const bigML = require('../bigMLController');


const predictController = require('../predictController');


// router.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

router.route('/').get(((req, res) => {
    res.render('./pages/predictTable');
}));

//------------ Socket.io ----------------
io.on("connection", (socket) => {
    socket.on('train', async (msg) => {  await bigML.createModel();});  // start train the model
    socket.on('predict', async (msg) => {bigML.isPredict = msg;});  // set value to start predict
});


// bigML.predict({'carType': "private", 'enterFrom': '5'})


module.exports = router;
