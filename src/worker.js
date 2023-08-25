const { parentPort, workerData } = require( "worker_threads") ;
const fibonacci = require('./fibonacci');

parentPort.on("message", (data) => {
  if (data.number) {
    fibonacci(data.type, data.number).then((res) => {
          parentPort.postMessage(res);
      });
  }
});

if (workerData?.number) {
    fibonacci(workerData.type, workerData.number).then((res) => {
        parentPort.postMessage(res);
        parentPort.close();
    })
}
