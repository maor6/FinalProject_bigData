const bigml = require('bigml');
const connection = new bigml.BigML('MAOR6',
    '38ac1c5989ac81437de09506c90dd86863e30a00');


const createCSV = require('./csvWriter');

var localModel;

const source = new bigml.Source();

const bigML = {
    createModel: async function () {
        // await createCSV.create();
        source.create('./files/events.csv', function(error, sourceInfo) {
            if (!error && sourceInfo) {
                const dataset = new bigml.Dataset();
                dataset.create(sourceInfo, function(error, datasetInfo) {
                    if (!error && datasetInfo) {
                        const model = new bigml.Model();
                        model.create(datasetInfo, function (error, modelInfo) {
                            if (!error && modelInfo) {
                                console.log(modelInfo.resource);
                                localModel = new bigml.LocalModel(modelInfo.resource);
                            }
                        });
                    }
                });
            }
        });
    },

    predict: function (event) {
        if (localModel) {
            const prediction = new bigml.Prediction();
            prediction.create(localModel, {'eventType': "exit road"}, function (error, predictionInfo) {
                if (!error && predictionInfo) {
                    console.log(prediction.resource);
                    const localModel = new bigml.LocalModel(prediction.resource);
                    localModel.predict({'carType': event.carType, 'exitFrom': event.enterFrom}, function(error, prediction) {
                        console.log("the prediction is: " + prediction.prediction);
                    });
                }
            });
        }
        else {
            // TODO send to client that he need first to train
            console.log("need to train first");
        }
    }
};


// const localModel = new bigml.LocalModel(prediction.resource);
// localModel.predict({'carType': "truck", 'eventType': "exit section"},
//     function(error, prediction) {
//         console.log("the prediction is: " + prediction.prediction);
//     });

// bigML.createModel();
// bigML.predict();
module.exports = bigML
