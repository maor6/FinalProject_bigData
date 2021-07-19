const express = require('express');
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

    // redisClient.publish("message", "{\"message\":\"Hello from Redis\"}", function () {
    // });

    res.send('תקשרתי עם רדיס....');
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

function initialize() {
    let sections = {0:0, 1:0, 2:0, 3:0, 4:0, 5:0};
    redisClient.set('sectionsNum', JSON.stringify(sections), function (err, reply) {
    });
}

redisClient.on('connect', function () {  // when we connect to redis
    console.log('Sender connected to Redis');
    initialize();  // initialize the data for the start
});


const Db = {
    updateNumCars: function (event) {
        redisClient.get('sectionsNum', (err, reply) => {
            let sections = JSON.parse(reply);
            if (err) throw err;
            if (event.eventType === "enter road") {
                sections[0]++;
            }
            else if(event.eventType === "exit road") {
                sections[0]--;
            }
            else if(event.eventType === "enter section") {
                redisClient.hmset(event.section, event._id, JSON.stringify(event));
                console.log(typeof event.section)
                sections[event.section]++;
            }
            else {
                redisClient.hdel(event.section, event._id);
                sections[event.section]--;
                if (sections[event.section] < 0) sections[event.section] = 0;
            }

            if (sections[0] < 0) sections[0] = 0;
            redisClient.set('sectionsNum', JSON.stringify(sections), function (err, reply2) {
                console.log("number of Cars: " + sections[1]+sections[2]+sections[3]+sections[4]+sections[5]);
            });

            redisClient.publish("message", JSON.stringify(sections), function () {  // send message that update the dashboard
            });
        });
    }
}


server.listen(6062, function () {
    console.log('Sender is running on port 6062');
});

module.exports = Db;
