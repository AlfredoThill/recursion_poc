const argv = require('minimist')(process.argv.slice(2));
const types = ['recursive', 'trampoline', 'iterative'];

const argNumber = Number(argv.number);
const argType =  types.includes(argv.type) ? argv.type : types[0];
let iterations = 0;
let fnCalls = 0;

// multiply all whole numbers from our chosen number down to 1. "n" is the chosen number

function iterativeFac(n) {
  fnCalls++  
  let answer = 1;
  if (n <= 1) return answer;
  for(var i = n; i >= 1; i--){
    iterations++
    answer = answer * i;
  }
  return answer;
}

function factorial(n) {
  fnCalls++
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

// trampoline fn
function trampoline(f) {
  return function trampolined(...args) {
    let result = f.bind(null, ...args);
    while (typeof result === 'function') result = result();
    return result;
  };
}
function _factorial(n, acc = 1) {
  fnCalls++
  if (n <= 1) return acc;
  return () => _factorial(n - 1, n * acc); // func to be called
}
const trampolineFactorial = trampoline(_factorial);

const typeRef = {
    recursive: factorial,
    iterative: iterativeFac,
    trampoline: trampolineFactorial
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

// node factorial.js  --number=8 --type=iterative
module.exports = timeTakingFunction;
