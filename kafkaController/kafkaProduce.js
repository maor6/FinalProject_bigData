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

function randomDate(start, end, startHour, endHour) {
  var date = new Date(+start + Math.random() * (end - start));
  var hour = startHour + Math.random() * (endHour - startHour) | 0;
  date.setHours(hour);
  return date;
}

const Events = {  // enum for days in the week
  0: "enter road",
  1: "enter section",
  2: "exit road",
  3: "exit section",
}

const CarType = {  // enum for days in the week
  0: "private",
  1: "van",
  2: "truck",
}

const DaysInWeek = {  // enum for days in the week
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
}

async function makeEvents() {
  while (true) {
    var message = {};
    message.date = randomDate(new Date(2021, 0, 1), new Date(), 0, 24);
    //message.id = row.cells[0].getElementsByTagName('div')[0].id;
    message.event = Events[Math.floor(Math.random() * 4)];
    message.section = Math.floor(Math.random() * 5) + 1;
    message.carType = CarType[Math.floor(Math.random() * 3)];
    message.isSpecialDay = Math.random() < 0.85;
    message.dayInWeek = DaysInWeek[message.date.getDay().toString()];
    //message.totalTime = (parseInt(Date.now()) - parseInt(message.id)) / 1000; // seconds
    await sleep(1000);
    console.log(message);
  }
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

makeEvents();

module.exports.publish= function(msg)  // export a function
{
  let m = JSON.stringify(msg);  // turn the msg to string
  producer.produce(topic, -1, genMessage(m), uuid.v4());  
  //producer.disconnect();
}