const argv = require('minimist')(process.argv.slice(2));
const types = ['recursive', 'dynamic', 'iterative'];

const argNumber = Number(argv.number);
const argType =  types.includes(argv.type) ? argv.type : types[0];
let iterations = 0;
let fnCalls = 0;

/* Note to self: remmeber to display delay on garbage collection with recursion, comment in the "localFatty" */

function iterativeFib(n) {
  fnCalls++  
  let a = 0, b = 1, c, i;
  if (n == 0) return a;
  for (i = 2; i <= n; i++) {
    c = a + b;
    a = b;
    b = c;
    iterations++
    // const localFatty = Array.from (Array(1000), () => new Array(2).fill(1));
  }
  return b;
}

// dynamic-programming
function dynamicFib(n, a = 0, b = 1) {
    fnCalls++
    // const localFatty = Array.from (Array(1000), () => new Array(2).fill(1));
    if (n == 0) return a;
    if (n == 1) return b;
    return dynamicFib(n - 1, b, a + b);
}

function fibonacci(num) {
    fnCalls++
    // const localFatty = Array.from (Array(1000), () => new Array(2).fill(1));
    if(num < 2) return num;
    return fibonacci(num - 1) + fibonacci(num - 2);
}

const typeRef = {
    recursive: fibonacci,
    iterative: iterativeFib,
    dynamic: dynamicFib
};

const timeTakingFunction = async (type, number, measureTime = false) => {
    measureTime && console.time('Execution Time');
    const fn = typeRef[type] ?? typeRef.recursive;

    let result;
    if (number > 0) result = fn(number);
    const msg = `The result of ${number} is ${result}. Type "${type}"`

    console.log(`Iterations: ${iterations}. Function calls: ${fnCalls}`);
    measureTime && console.timeEnd('Execution Time');

    return msg;
};

if (argNumber) {
  timeTakingFunction(argType, argNumber, true).then((msg) => console.log(msg));
};

// node fibonacci.js  --number=8 --type=iterative
module.exports = timeTakingFunction;
