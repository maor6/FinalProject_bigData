const Json2csvParser = require("json2csv").Parser;
const fs = require("fs");

const mongo = require('./model/mongoDBController');

function filterData(data) {
    return new Promise((resolve, reject) => {
        let result = data.filter(item =>
            (item.eventType === "exit road" || item.eventType === "enter road"))
            .reduce(function(map, obj) {
                if (obj.eventType === "enter road") {
                    if (map[obj.carNumber]) {  // the obj is in the map already
                        let exit = map[obj.carNumber].exitFrom;
                        delete map[obj.carNumber].exitFrom;
                        map[obj.carNumber].enterFrom = obj.section;
                        map[obj.carNumber].exitFrom = exit;  // need the exitFrom be the last element of the obj
                    }
                    else {
                        obj.enterFrom = obj.section;
                        map[obj.carNumber] = obj;
                    }
                }
                else if (obj.eventType === "exit road") {
                    if (map[obj.carNumber]) { // the obj is in the map already
                        map[obj.carNumber].exitFrom = obj.section.toString();
                    }
                    else {  // handle that obj is not in the map
                        obj.exitFrom = obj.section.toString();
                        map[obj.carNumber] = obj;
                    }
                }

                delete obj.eventType;
                delete obj._id;
                delete obj.carNumber;
                delete obj.section;
                delete obj.date;

                return map;
            }, {});
        // TODO if a car dont have exit (because miss of message) add one OR fix in simulator or filter the data
        if (result) {
            resolve(result);
        }
        else {
            reject("undefined");
        }
    });
}

async function createFile(data) {  // help function to save the file
    let result = await filterData(data);
    let resultArr = [];
    Object.keys(result).map(function(key, index) {
        resultArr.push(result[key]);
    });

    resultArr = resultArr.filter((obj) => {  // filter the cars that do not have exitFrom
        return obj.exitFrom;
    });

    const json2csvParser = new Json2csvParser({ header: true });
    const csvData = json2csvParser.parse(resultArr);

     fs.writeFile('./files/events.csv', csvData, function(error) {
        if (error) throw error;
        console.log("Write to csv successfully!");
    });
}

const createCSV = {
    readAndCreate: async () => {
        const data = await mongo.ReadData();
        await createFile(data);
    }
};

// createCSV.readAndCreate();
module.exports.create = createCSV.readAndCreate;
