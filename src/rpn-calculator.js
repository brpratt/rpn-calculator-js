const IntegerParser = require('./integer-parser');

const STACK_LENGTH_ERROR = 'Too few elements on stack.';
const UNKNOWN_OPERATION_ERROR = 'Unknown operation.';

function add(rpn) {
  if (rpn._stack.length < 2) {
    throw Error(STACK_LENGTH_ERROR);
  }

  const num1 = rpn._stack.pop();
  const num2 = rpn._stack.pop();
  rpn._stack.push(num1 + num2);
}

function multiply(rpn) {
  if (rpn._stack.length < 2) {
    throw Error(STACK_LENGTH_ERROR);
  }

  const num1 = rpn._stack.pop();
  const num2 = rpn._stack.pop();
  rpn._stack.push(num1 * num2);
}

class RpnCalculator {
  constructor() {
    this._stack = [];
  }

  enter(input) {
    switch (input) {
      case '+':
        add(this);
        break;
      case '*':
        multiply(this);
        break;
      default:
        const parsed = IntegerParser.parse(input);
        if (isNaN(parsed)) {
          throw Error(UNKNOWN_OPERATION_ERROR);
        }
        this._stack.push(parsed);
    }
  }

  get stack() {
    return this._stack;
  }
}

module.exports = RpnCalculator;
