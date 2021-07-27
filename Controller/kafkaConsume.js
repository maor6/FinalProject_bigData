// https://www.cloudkarafka.com/ הפעלת קפקא במסגרת ספק זה

const uuid = require("uuid");
const Kafka = require("node-rdkafka");

//------------mongo------------------
const mongo = require('./../model/mongoDBController');

//----------Redis--------------------
const redis = require('./../model/RedisForArielSender');

const predictController = require('../predictController');

//-----------bigML--------------
const bigML = require('../bigMLController');

const kafkaConf = {
  "group.id": "cloudkarafka-example",
  "metadata.broker.list": "sulky-01.srvs.cloudkafka.com:9094,sulky-02.srvs.cloudkafka.com:9094,sulky-03.srvs.cloudkafka.com:9094".split(","),
  "socket.keepalive.enable": true,
  "security.protocol": "SASL_SSL",
  "sasl.mechanisms": "SCRAM-SHA-256",
  "sasl.username": "bctx5ov3",
  "sasl.password": "dLIoD4Zwos50BYKGAQnTFO6wM_9bIY4_",
  "debug": "generic,broker,security"
};

const prefix = "bctx5ov3-";
const topic = `${prefix}events`;

// const kafkaConf = {
//   "group.id": "cloudkarafka-example",
//   "metadata.broker.list": "dory-01.srvs.cloudkafka.com:9094,dory-02.srvs.cloudkafka.com:9094,dory-03.srvs.cloudkafka.com:9094".split(","),
//   "socket.keepalive.enable": true,
//   "security.protocol": "SASL_SSL",
//   "sasl.mechanisms": "SCRAM-SHA-256",
//   "sasl.username": "t2fulcgc",
//   "sasl.password": "ymmnjcZMj77xrz-zbAnYA8n9n9CicxO0",
//   "debug": "generic,broker,security"
// };
//
// const prefix = "t2fulcgc-";
// const topic = `${prefix}default`;
// const producer = new Kafka.Producer(kafkaConf);

const genMessage = m => new Buffer.alloc(m.length,m);
//const prefix = process.env.CLOUDKARAFKA_USERNAME;

const topics = [topic];
var consumer = new Kafka.KafkaConsumer(kafkaConf, {
  "auto.offset.reset": "beginning"
});

consumer.connect();

consumer.on("error", function(err) {
  console.error(err);
});

consumer.on("ready", function(arg) {
  console.log(`Consumer ${arg.name} ready`);
  consumer.subscribe(topics);
  consumer.consume();
});

const map1 = new Map();  // map that save us cars and where they predict to exit the road


consumer.on("data", async function(m) {
  console.log("data received");
  const json = JSON.parse(m.value.toString());
  await redis.updateNumCars(json);  // save data to redis
  // await mongo.CreateEvent(json);  // save data to mongoDB
  // console.log(json);
  if (bigML.isPredict) {
    if (json.eventType === "enter road") {
      let predictData = {carType: json.carType, enterFrom: json.section};
      let pre = await bigML.predict(predictData);
      let pre3 = bigML.pre3;
      // console.log("the prediction is: " + pre);
      // console.log("pre3 is: " + pre3);
      pre = 2;
      map1.set(json.carNumber, Math.round(pre)); // save the car number and his prediction
    }
    if (json.eventType === "exit road") {  // the exit the road and we want to update the table if the model is correct
      if (map1.has(json.carNumber)) {  // the car is in the map
        let obj = {pre: map1.get(json.carNumber), real: json.section};
        io.emit('prediction', obj);
        map1.delete(json.carNumber);
      }
    }
  }
});


consumer.on("disconnected", function(arg) {
  process.exit();
});

consumer.on('event.error', function(err) {
  console.error(err);
  process.exit(1);
});

consumer.on('event.log', function(log) {
  //console.log(log);
});
