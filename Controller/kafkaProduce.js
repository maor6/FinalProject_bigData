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
  console.log(`simulator is running...`);
  makeEvents();  // start the simulator
});

function publish(msg)  // export a function
{
  msg._id = uuid.v4();
  let m = JSON.stringify(msg);  // turn the msg to string
  producer.produce(topic, -1, genMessage(m), msg._id);
  //producer.disconnect();
};

(async () => {
  await producer.connect();
})();

function randomDate(start, end, startHour, endHour) {
  let date = new Date(+start + Math.random() * (end - start));
  const hour = startHour + Math.random() * (endHour - startHour) | 0;
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

async function  makeEvents () {  // Simulator TODO wirte it to new file
  var map = {};

  while (true) {
    const key = Math.floor(Math.random() * 5);
    if(key in map) {
      const numOfSection = map[key].section;
      if(numOfSection === 5) {  // Car is in the last section and exit the road
        exitRoad(map, key);
      }
      else {
        if(Math.random() < 0.6) {  // Probability that car continue to next section
          map[key].eventType = Events[3];
          await publish(map[key]);
          map[key].eventType = Events[1];
          map[key].section = map[key].section + 1; //enter to the next section
          await publish(map[key]);
        }
        else {
          exitRoad(map, key);
        }
      }
    }
    else {
      let event = {}; // create a new event and add to map
      event.date = randomDate(new Date(2021, 0, 1), new Date(), 0, 24);
      //message.id = row.cells[0].getElementsByTagName('div')[0].id;
      event.section = Math.floor(Math.random() * 5) + 1;
      event.carType = CarType[Math.floor(Math.random() * 3)];
      event.isSpecialDay = Math.random() < 0.15;  // TODO need to fix SpecialDay to get it right
      event.dayInWeek = DaysInWeek[event.date.getDay().toString()];
      event.eventType = Events[0];
      //message.totalTime = (parseInt(Date.now()) - parseInt(message.id)) / 1000; // seconds

      map[key] = event;
      await publish(map[key]);
      map[key].eventType = Events[1];
      await publish(map[key]);
    }

    await sleep(2000);
  }
}

async function exitRoad(map, key) {  // help function that handle when car is exit the road
  map[key].eventType = Events[3];
  await publish(map[key]);
  map[key].eventType = Events[2];
  await publish(map[key]);
  delete map[key];
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}


module.exports.publish= publish;
