const bigml = require('bigml');
const connection = new bigml.BigML('MAOR6',
    '38ac1c5989ac81437de09506c90dd86863e30a00');

const source = new bigml.Source();
const bigML = {
    createModel: function () {
        source.create('./files/events.csv', function(error, sourceInfo) {
            if (!error && sourceInfo) {
                const dataset = new bigml.Dataset();
                dataset.create(sourceInfo, function(error, datasetInfo) {
                    if (!error && datasetInfo) {
                        const model = new bigml.Model();
                        model.create(datasetInfo, function (error, modelInfo) {
                            if (!error && modelInfo) {
                                console.log(modelInfo.resource);
                                let localModel = new bigml.LocalModel(modelInfo.resource);
                                return localModel;
                                // localModel.predict({'petal length': 1}, function(error, prediction) {
                                //     console.log(prediction)
                                // });
                                // const prediction = new bigml.Prediction();
                                // prediction.create(modelInfo, {'eventType': "exit road"}, function (error, predictionInfo) {
                                //     console.log(prediction.resource);
                                //     const localModel = new bigml.LocalModel(prediction.resource);
                                //     localModel.predict({'carType': "truck", 'eventType': "exit road"}, function(error, prediction) {
                                //         console.log("the prediction is: " + prediction.prediction);
                                //     });
                                // });
                            }
                        });
                    }
                });
            }
        });
    }
}

bigML.createModel();
// const localModel = new bigml.LocalModel(prediction.resource);
// localModel.predict({'carType': "truck", 'eventType': "exit section"},
//     function(error, prediction) {
//         console.log("the prediction is: " + prediction.prediction);
//     });
