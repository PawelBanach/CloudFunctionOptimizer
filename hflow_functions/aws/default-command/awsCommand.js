//var request = require('request');
const request = require('requestretry');
const executorConfig = require('./awsCommand.config.js');
const identity = function (e) {return e};

function retryStrategy(err, response, body) {
  return err || response.statusCode >= 400 || request.RetryStrategies.HTTPOrNetworkError(err, response);
}

function awsCommand(ins, outs, config, cb) {

  const options = executorConfig.options;
  if (config.executor.hasOwnProperty('options')) {
    const executorOptions = config.executor.options;
    for (let opt in executorOptions) {
      if (executorOptions.hasOwnProperty(opt)) {
        options[opt] = executorOptions[opt];
      }
    }
  }
  const executable = config.executor.executable;
  const jobMessage = {
    "executable": executable,
    "args": config.executor.args,
    "env": (config.executor.env || {}),
    "inputs": ins.map(identity),
    "outputs": outs.map(identity),
    "options": options
  };

  console.log("Executing:  " + JSON.stringify(jobMessage));

  const functionType = config.deploymentType ? config.deploymentType : executorConfig.functionType;
  const url = executorConfig.resources[functionType];

  function optionalCallback(err, response, body) {
    const request_end = Date.now();
    if (err) {
      console.log("Function: " + executable + " error: " + err);
      cb(err, outs);
      return
    }
    if (response) {
      console.log("Function: " + executable + " response status code: " + response.statusCode + " number of request attempts: " + response.attempts)
    }
    const request_duration = request_end - request_start;
    console.log("Function: " + executable + " id: " + config.id + " resource: " + functionType + " request_start: " + request_start + " request_end: " + request_end + " request_duration: " + request_duration + " data: " + body.message);
    cb(null, outs);
  }

  const request_start = Date.now();
  request.post({
    retryDelay: 1000,
    timeout: 600000,
    retryStrategy: retryStrategy,
    maxAttempts: 30,
    url: url,
    json: jobMessage,
    headers: {'Content-Type': 'application/json', 'Accept': '*/*'}
  }, optionalCallback);

}

exports.awsCommand = awsCommand;