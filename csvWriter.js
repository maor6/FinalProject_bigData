const Json2csvParser = require("json2csv").Parser;
const fs = require("fs");

const mongo = require('./model/mongoDBController');

function filterData(data) {
    let result = data.filter(item =>
        (item.eventType === "exit road" || item.eventType === "enter road"))
        .reduce(function(map, obj) {
            if (obj.eventType === "enter road") {
                obj.enterFrom = obj.section;
                map[obj.carNumber] = obj;
            }
            else if (obj.eventType === "exit road") {
                map[obj.carNumber].exitFrom = obj.section;
            }
            delete obj.eventType;
            delete obj._id;
            delete obj.carNumber;
            delete obj.section;

            return map;
        }, {});
    // TODO if a car dont have exit (because miss of message) add one OR fix in simulator
    return result;
}

async function createFile(data) {  // help function to save the file
    let result = (await filterData)(data);

    let resultArr = [];
    Object.keys(result).map(function(key, index) {
        resultArr.push(result[key]);
    });

    const json2csvParser = new Json2csvParser({ header: true });
    const csvData = json2csvParser.parse(resultArr);

    fs.writeFile('./files/events.csv', csvData, function(error) {
        if (error) throw error;
        console.log("Write to csv successfully!");
    });
}

const createCSV = {
    readAndCreate: () => {
        mongo.ReadData(createFile);
    }
};

// createCSV.readAndCreate();
module.exports.create = createCSV.readAndCreate;
