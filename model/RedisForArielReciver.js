const express = require('express');
const app = require('express')();
const redis = require('redis');
const redisClient = redis.createClient();
const server = require('http').createServer(app);


redisClient.subscribe('message'); 

app.get('/', (req, res) => res.send('Hello World!'))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


redisClient.on("message", function (channel, msg) {
    let data = JSON.parse(msg);
    // do things with the data
    // data.variable1 = 3;
    // data.variable2 = "hello";
    let number = 0;
    redisClient.get('NumberOfCars', (err, reply) => {
        number = reply;
    });

    //TODO with WS render the page to update the number of cars
});


redisClient.on('connect', function() {
    console.log('Receiver connected to Redis');
});


server.listen(6061, function() {
    console.log('receiver is running on port 6061');
});
