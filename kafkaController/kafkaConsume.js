// https://www.cloudkarafka.com/ הפעלת קפקא במסגרת ספק זה

const uuid = require("uuid");
const Kafka = require("node-rdkafka");

//------------mongo------------------
const mongo = require('./../model/mongoDBController');

//----------Redis--------------------
const redis = require('./../model/RedisForArielSender');

const kafkaConf = {
  "group.id": "cloudkarafka-example",
  "metadata.broker.list": "dory-01.srvs.cloudkafka.com:9094,dory-02.srvs.cloudkafka.com:9094,dory-03.srvs.cloudkafka.com:9094".split(","),
  "socket.keepalive.enable": true,
  "security.protocol": "SASL_SSL",
  "sasl.mechanisms": "SCRAM-SHA-256",
  "sasl.username": "ozdzk6dk",
  "sasl.password": "urnoiE00jpgXLkaOvZNxeetu-21X1SZb",
  "debug": "generic,broker,security"
};

const prefix = "ozdzk6dk-";
const topic = `${prefix}cars`;
const producer = new Kafka.Producer(kafkaConf);

const genMessage = m => new Buffer.alloc(m.length,m);
//const prefix = process.env.CLOUDKARAFKA_USERNAME;

const topics = [topic];
const consumer = new Kafka.KafkaConsumer(kafkaConf, {
  "auto.offset.reset": "beginning"
});

consumer.on("error", function(err) {
  console.error(err);
});
consumer.on("ready", function(arg) {
  console.log(`Consumer ${arg.name} ready`);
  consumer.subscribe(topics);
  consumer.consume();
});

consumer.on("data", function(m) {
  //console.log("data received");
  //console.log(m.value.toString());
  const json = JSON.parse(m.value.toString());
  mongo.CreateEvent(json);
  redis.updateNumCars(json);
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
consumer.connect();
