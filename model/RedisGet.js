const express = require('express');
const app = require('express')();
const redis = require('redis');
const redisClient = redis.createClient();
const server = require('http').createServer(app);



redisClient.on('connect', function() {
    console.log('Get connected to Redis');
});

// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

server.listen(6063, function() {
    console.log('Get is running on port 6063');
});

const getRedisData = {
    getSectionList: function (sectionNum, sendToViewTheList) {
        redisClient.hgetall(sectionNum, function(err, result){
            if(err) console.log(err);
            sendToViewTheList(result);
        });
    }
}

module.exports.getRedisData = getRedisData;
