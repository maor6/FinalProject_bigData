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
        // await createCSV.create();
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
            console.log("prediction is:" + prediction.prediction);
            pre2 = prediction.prediction;
            p3 = prediction.prediction;
        });

        console.log("pre2 is:" + pre2);  // TODO fix that pre2 is initialize
        return pre2;
    },
    isPredict: isPredict,
}

module.exports = bigML
