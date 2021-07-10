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


(async () => {
  await producer.connect();
  makeEvents();
})();

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
  var map = {};

  while (true) {
    var key = Math.floor(Math.random() * 5);
    if(key in map) {
      var numOfSection = map[key].section;
      if(numOfSection === 5) {  // Car is in the last section and exit the road
        exitRoad(map, key);
      }
      else {
        if(Math.random() < 0.6) {  // Probability that car continue to next section
          map[key].eventType = Events[3];
          //publish(map[key]);
          console.log(map[key]);
          map[key].eventType = Events[1];
          map[key].section = map[key].section + 1; //enter to the next section
          //publish(map[key]);
          console.log(map[key]);
        }
        else {
          exitRoad(map, key);
        }
      }
    }
    else {
      var event = {}; // create a new event and add to map
      event.date = randomDate(new Date(2021, 0, 1), new Date(), 0, 24);
      //message.id = row.cells[0].getElementsByTagName('div')[0].id;
      event.eventType = Events[0];
      event.section = Math.floor(Math.random() * 5) + 1;
      event.carType = CarType[Math.floor(Math.random() * 3)];
      event.isSpecialDay = Math.random() < 0.15;
      event.dayInWeek = DaysInWeek[event.date.getDay().toString()];
      //message.totalTime = (parseInt(Date.now()) - parseInt(message.id)) / 1000; // seconds
      map[key] = event;
      //publish(map[key]);
      console.log(map[key]);
      map[key].eventType = Events[1];
      //publish(map[key]);
      console.log(map[key]);
    }

    await sleep(1000);
  }
}

function exitRoad(map, key) {
  map[key].eventType = Events[3];
  //publish(map[key]);
  console.log(map[key]);
  map[key].eventType = Events[2];
  //publish(map[key]);
  console.log(map[key]);
  delete map[key];
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}


module.exports.publish= function (msg)  // export a function
{
  let m = JSON.stringify(msg);  // turn the msg to string
  producer.produce(topic, -1, genMessage(m), uuid.v4());
  //producer.disconnect();
};
