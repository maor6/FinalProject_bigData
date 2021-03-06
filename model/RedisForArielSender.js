const express = require('express');
const app = require('express')();
const server = require('http').Server(app);
const redis = require('redis');
const { isObject } = require('util');
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
    redisClient.flushdb( function (err, succeeded) {
        console.log(succeeded); // will be true if successfull
    });
    let sections = {0:0, 1:0, 2:0, 3:0, 4:0, 5:0};
    redisClient.set('sectionsNum', JSON.stringify(sections), function (err, reply) {
    });

}

redisClient.on('connect', function () {  // when we connect to redis
    console.log('Sender connected to Redis');
    initialize();  // initialize the data for the start
});


const Db = {
    updateNumCars: async function (event) {
        redisClient.get('sectionsNum', async (err, reply) => {
            let sections = JSON.parse(reply);
            if (err) console.error(err);
            if (event.eventType === "enter road") {
                sections[0]++;
            }
            else if(event.eventType === "exit road") {
               await redisClient.hdel(event.section, event.carNumber);
                sections[0]--;
            }
            if(event.eventType === "enter section") {
                await redisClient.hset(event.section, event.carNumber, JSON.stringify(event));
                sections[event.section]++;
            }
            else if(event.eventType === "exit section"){
                await redisClient.hset(event.section, event.carNumber, JSON.stringify(event));
                sections[event.section]--;
            }
            await redisClient.set('sectionsNum', JSON.stringify(sections));
            let number = sections[1]+sections[2]+sections[3]+sections[4]+sections[5];
            
            console.log("number of Cars: " + number);
         
            redisClient.publish("message", JSON.stringify(sections), function () {  // send message that update the dashboard
            });
            await sleep(1000);
        });
    }
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
} 
module.exports = Db;
