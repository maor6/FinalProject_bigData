const Json2csvParser = require("json2csv").Parser;
const fs = require("fs");

const mongo = require('./model/mongoDBController');


function createFile(data) {  // help function to save the file
    const json2csvParser = new Json2csvParser({ header: true });
    const csvData = json2csvParser.parse(data);

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

module.exports.createCSV = createCSV
