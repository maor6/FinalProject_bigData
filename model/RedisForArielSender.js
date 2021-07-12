var express = require('express');
const app = require('express')();
const server = require('http').Server(app);
const redis = require('redis');
const redisClient = redis.createClient();


// for explanations : https://www.sitepoint.com/using-redis-node-js/

app.get('/test', function (req, res) {

    // Store string  
    redisClient.set('NumberOfCars', 0, function (err, reply) {
        console.log(reply);
    });

    //Store and get Hash i.e. object( as keyvalue pairs)
    redisClient.hmset('Sections',"one", 'Sorek',"two", 'Nesharim',"three", 'BenShemen', "four",'nashonim',"five", 'kesem');
    redisClient.hgetall('Sections', function (err, object) {
        console.log(object);
    });
    /*
    also ok:
    redisClient.hmset('Sections', {
                        'javascript': 'AngularJS',
                        'css': 'Bootstrap',
                        'node': 'Express'
                        });
    */

// lists : rpush or lpush
/* client.rpush(['frameworks', 'angularjs', 'backbone'], function(err, reply) {
    console.log(reply); //prints 2
});

// -1= get all
client.lrange('frameworks', 0, -1, function(err, reply) {
    console.log(reply); // ['angularjs', 'backbone']
}); */

    redisClient.publish("message", "{\"message\":\"Hello from Redis\"}", function () {
    });

    res.send('תקשרתי עם רדיס....');
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

function initialize() {
    redisClient.set('NumberOfCars', 0, function (err, reply) {
    });
}

redisClient.on('connect', function () {
    console.log('Sender connected to Redis');
    initialize();
});


const Db = {
    updateNumCars: function (event) {
        redisClient.get('NumberOfCars', (err, reply) => {
            let updatedCarsNum = reply;
            if (err) throw err;
            if (event.eventType === "enter road") {
                updatedCarsNum++;
            }

            else if(event.eventType === "exit road") {
                updatedCarsNum--;
            }
            else if(event.eventType === "enter section") {
                redisClient.hmset(event.section, event._id, JSON.stringify(event));
            }
            else {
                redisClient.del(event.section, event._id);
            }
            if (updatedCarsNum < 0) updatedCarsNum = 0;
            redisClient.set('NumberOfCars', updatedCarsNum, function (err, reply2) {
                console.log("number of Cars: " + updatedCarsNum);
            });

            redisClient.publish("message", JSON.stringify(event), function () {
            });
        });
    }
}


server.listen(6062, function () {
    console.log('Sender is running on port 6062');
});

module.exports = Db;
