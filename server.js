const http = require('http');
const { Worker } = require( "worker_threads");
const fibonacci = require('./src/fibonacci');
const port = 3000;

const fibonacciWorker = new Worker("./src/worker.js", { resourceLimits: {
    maxYoungGenerationSizeMb: 5,
    maxOldGenerationSizeMb: 5,
    codeRangeSizeMb: 5,
    stackSizeMb: 5,
}});
fibonacciWorker.on("online", () => console.log('Worker started'));
fibonacciWorker.on('exit', (code) => console.log(`Worker stopped with exit code ${code}`));

/* Note to self: remmeber to display TCO on Safari with
  *  "use strict"
  *  function dynamicFib(n, a = 0, b = 1) {
  *      if (n == 0) return a;
  *      if (n == 1) return b;
  *      return dynamicFib(n - 1, b, a + b);
  *  }
*/

http
  .createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    console.log('Incoming request to:', url.pathname);
    const number = Number(url.searchParams.get('number'));
    const type = url.searchParams.get('type');

    // curl --get "http://localhost:3000/fibonacci?number=10&type=iterative"
    if (url.pathname === '/fibonacci') {
      console.log(`Calculating fibonacci for ${number}, type ${type}`);
      fibonacci(type, number, true).then((result) => {
        res.writeHead(200);
        console.log('Request resolved');
        return res.end(`Result: ${result}`);
      }).catch((e) => {
        res.writeHead(500);
        console.log('Request errored out');
        return res.end(JSON.stringify(e));
      });
    // curl --get "http://localhost:3000/fibonacci-worker?number=10&type=iterative"
    } else if(url.pathname === '/fibonacci-worker') {
      console.log(`Calculating fibonacci w/worker for ${number}, type ${type}`);
      fibonacciWorker.postMessage({number, type});
      fibonacciWorker.on("message", (result) => {
        res.writeHead(200);
        console.log('Request resolved');
        return res.end(`Executed in worker. ${result}`);
       });
       fibonacciWorker.on("error" , (e) => {
        res.writeHead(500);
        console.log('Request errored out');
        return res.end(JSON.stringify(e));
       });
    } else {
      res.writeHead(200);
      return res.end('Hi there!');
    }
  })
  .listen(port, () => console.log(`Listening on port ${port}...`));
