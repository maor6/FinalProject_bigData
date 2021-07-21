const express = require('express');
const app = express();
const server = require('http').createServer(app);
// const io = require("socket.io")(server);
global.io = require('socket.io')(server);
const port = 3000;


//------------ kafka------------
// const kafka = require('./Controller/kafkaProduce');


const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.set('view engine', 'ejs');
app.use(express.static("public"));


const dash = require("./routes/dashBoard");
app.use("/dashboard", dash);

const table = require("./routes/table");
app.use("/table", table);


app.get('/', (req, res) => {
    res.send("<a href='/send'>Send</a> <br/><a href=''>View</a>");
});

app.get('/send', (req, res) => {
    res.render('./pages/sender');
});


//------------ Socket.io ----------------
io.on("connection", (socket) => {
    console.log("new user connected");
    socket.on("totalWaitingCalls", (msg) => { console.log(msg.totalWaiting); });
    socket.on("callDetails", (msg) => { console.log(msg);kafka.publish(msg); });
});


server.listen(port, () => {
    console.log(`Ariel app listening at http://localhost:${port}`);
});
