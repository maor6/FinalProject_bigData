// https://www.cloudkarafka.com/ הפעלת קפקא במסגרת ספק זה

const uuid = require("uuid");
const Kafka = require("node-rdkafka");

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

producer.on("ready", function(arg) {
  console.log(`producer is ready.`);
});
producer.connect();

module.exports.publish= function(msg)  // export a function
{
  let m = JSON.stringify(msg);  // turn the msg to string
  producer.produce(topic, -1, genMessage(m), uuid.v4());  
  //producer.disconnect();
}