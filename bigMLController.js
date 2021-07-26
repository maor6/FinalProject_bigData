const bigml = require('bigml');
const connection = new bigml.BigML('MAOR6',
    '38ac1c5989ac81437de09506c90dd86863e30a00');


const createCSV = require('./csvWriter');
const predictController = require('./predictController');

var localModel;
var modelInfo2;

const source = new bigml.Source();
//var pre;
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
    predict: async function () {
        let prediction = new bigml.Prediction();
        prediction.create(modelInfo2,{'enterFrom':3}, function (err, pre) {});
        localModel = new bigml.LocalModel(prediction.resource);
        return await localModel.predict({'enterFrom':3});
    }
}

// const localModel = new bigml.LocalModel(prediction.resource);
// localModel.predict({'carType': "truck", 'eventType': "exit section"},
//     function(error, prediction) {
//         console.log("the prediction is: " + prediction.prediction);
//     });

// bigML.createModel();
// bigML.predict();

module.exports = bigML
//module.exports = pre
