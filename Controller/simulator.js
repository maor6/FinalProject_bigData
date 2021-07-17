const uuid = require("uuid");


const Events = {  // enum for days in the week
    0: "enter road",
    1: "enter section",
    2: "exit road",
    3: "exit section",
}

const CarType = {  // enum for car type
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


function randomDate(start, end, startHour, endHour) {  // function that get us random date
    let date = new Date(+start + Math.random() * (end - start));
    const hour = startHour + Math.random() * (endHour - startHour) | 0;
    date.setHours(hour);
    return date;
}


async function  makeEvents (publish) {  // Simulator
    console.log(`simulator is running...`);
    var map = {};

    while (true) {
        const key = Math.floor(Math.random() * 100);
        if(key in map) {
            const numOfSection = map[key].section;  // the current section of the car
            if(numOfSection === 5) {  // Car is in the last section and exit the road
                await (exitRoad)(map, key, publish);
            }
            else {
                if(Math.random() < 0.6) {  // Probability that car continue to next section
                    map[key].eventType = Events[3];
                    await (publish)(map[key]);
                    map[key].eventType = Events[1];
                    map[key].section = map[key].section + 1; //enter to the next section
                    await (publish)(map[key]);
                }
                else {  // the car want to exit the road
                    await (exitRoad)(map, key, publish);
                }
            }
        }
        else {
            let event = {}; // create a new event and add to map
            event.date = randomDate(new Date(2021, 0, 1), new Date(), 0, 24);
            event.carNumber = uuid.v4();
            //message.id = row.cells[0].getElementsByTagName('div')[0].id;
            event.carType = CarType[Math.floor(Math.random() * 3)];
            event.isSpecialDay = Math.random() < 0.15;  // TODO need to fix SpecialDay to get it right
            event.dayInWeek = DaysInWeek[event.date.getDay().toString()];
            event.eventType = Events[0];
            event.section = Math.floor(Math.random() * 5) + 1;

            map[key] = event;  // add the event to the map
            await (publish)(map[key]);
            map[key].eventType = Events[1];  // change that the car enter also to some section
            await (publish)(map[key]);
        }

        await (sleep)(2000);
    }
}

async function exitRoad(map, key, publish) {  // help function that handle when car is exit the road
    map[key].eventType = Events[3];
    await (publish)(map[key]);
    map[key].eventType = Events[2];
    await (publish)(map[key]);
    delete map[key];
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

module.exports.startSimulator = makeEvents;
