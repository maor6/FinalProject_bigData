const bigml = require('bigml');
const connection = new bigml.BigML('MAOR6',
    '38ac1c5989ac81437de09506c90dd86863e30a00');


const createCSV = require('./csvWriter');
const predictController = require('./predictController');

var localModel;
var modelInfo2;
var isPredict = false;

const source = new bigml.Source();

const bigML = {
    createModel: async function () {
        await createCSV.create();
        await sleep(250);
        source.create('./files/events.csv', function(error, sourceInfo) {
            if (!error && sourceInfo) {
                const dataset = new bigml.Dataset();
                dataset.create(sourceInfo, function(error, datasetInfo) {
                    if (!error && datasetInfo) {
                        var model = new bigml.Model();
                        model.create(datasetInfo, function (error, modelInfo) {
                            if (!error && modelInfo) {
                                console.log("model created");
                                modelInfo2 = modelInfo;
                            }
                        });
                    }
                });
            }
        });
    },
    predict: async function (predictData) {
        let prediction = new bigml.Prediction();
        let pre2;
        await prediction.create(modelInfo2, predictData,function (err, pre) {
        });
        localModel = new bigml.LocalModel(prediction.resource);
        await localModel.predict(predictData,function (err, prediction) {
            pre2 = prediction.prediction;
            p3 = prediction.prediction;
        });
        await sleep(2000)
        return pre2;
    },
    isPredict: isPredict,
}


function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

module.exports = bigML
