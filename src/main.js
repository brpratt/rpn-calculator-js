const readline = require('readline');
const RpnCalculator = require('./rpn-calculator');

function showRpnStack(rpn) {
  console.log(`stack: [${rpn.stack.join(' ')}]`);
}

const rpn = new RpnCalculator();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  try {
    rpn.enter(input);
  } catch (e) {
    console.log(e.message);
  }

  showRpnStack(rpn);
  rl.prompt();
}).on('close', () => {
  console.log();
});

rl.prompt();
