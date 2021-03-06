// https://www.cloudkarafka.com/ הפעלת קפקא במסגרת ספק זה

const uuid = require("uuid");
const Kafka = require("node-rdkafka");
const simulator = require("./simulator");


// const kafkaConf = {
//   "group.id": "cloudkarafka-example",
//   "metadata.broker.list": "dory-01.srvs.cloudkafka.com:9094,dory-02.srvs.cloudkafka.com:9094,dory-03.srvs.cloudkafka.com:9094".split(","),
//   "socket.keepalive.enable": true,
//   "security.protocol": "SASL_SSL",
//   "sasl.mechanisms": "SCRAM-SHA-256",
//   "sasl.username": "ozdzk6dk",
//   "sasl.password": "urnoiE00jpgXLkaOvZNxeetu-21X1SZb",
//   "debug": "generic,broker,security"
// };
//
//
// const prefix = "ozdzk6dk-";
// const topic = `${prefix}cars`;

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

function publish(msg)  // export a function
{
  msg._id = uuid.v1();
  let m = JSON.stringify(msg);  // turn the msg to string
  producer.produce(topic, -1, genMessage(m), msg._id);
  //producer.disconnect();
};


const producer = new Kafka.Producer(kafkaConf);

const genMessage = m => new Buffer.alloc(m.length,m);

producer.on("ready", function(arg) {
  console.log(`producer is ready.`);
  simulator.startSimulator(publish);  // start the simulator
});


producer.connect();

module.exports.publish= publish;
