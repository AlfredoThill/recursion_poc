const { Worker } = require( "worker_threads");
const argv = require('minimist')(process.argv.slice(2));
const types = ['recursive', 'dynamic', 'iterative'];

const data = {
    number: Number(argv.number),
    type: types.includes(argv.type) ? argv.type : types[0]
};
const limits = {
    maxYoungGenerationSizeMb: 500,
    maxOldGenerationSizeMb: 500,
    codeRangeSizeMb: 500,
    stackSizeMb: 500,
};

console.time('Execution Time');
const worker = new Worker("./worker.js", { workerData: data, resourceLimits: limits});                                          
worker.on("message", (result) => {
    console.log(`Executed in worker. ${result}`);
    console.timeEnd('Execution Time');
});
worker.on("error" , (error) => console.error(error));
worker.on("online", () => console.log('Worker started'));
worker.on('exit', (code) => console.log(`Worker stopped with exit code ${code}`));

// node main.js  --number=8 --type=iterative
