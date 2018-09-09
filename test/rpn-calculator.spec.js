const {expect} = require('chai');
const sinon = require('sinon');
const Chance = require('chance');
const RpnCalculator = require('../src/rpn-calculator');
const IntegerParser = require('../src/integer-parser');

const INT_RANGE = {
  max: 100000,
  min: -100000
};

const sandbox = sinon.createSandbox();
const chance = Chance();

describe('RpnCalculator', () => {
  let rpn;

  beforeEach(() => {
    rpn = new RpnCalculator();
  });

  afterEach(() => {
    sandbox.restore();
  })

  it('Should add single number to stack.', () => {
    const num = chance.integer();
    rpn.enter(num.toString());

    expect(rpn.stack.length).to.equal(1);
    expect(rpn.stack[0]).to.equal(num);
  });

  it('Should add multiple numbers to stack.', () => {
    const nums = chance.n(chance.integer, 3);

    nums.forEach((value) => rpn.enter(value.toString()));

    nums.forEach((value, index) => {
      expect(rpn.stack[index]).to.equal(value);
    });
  });

  it('Should use IntegerParser to parse the numbers.', () => {
    const input = chance.integer().toString();
    const parsed = chance.integer();

    sandbox.stub(IntegerParser, 'parse').returns(parsed);
    rpn.enter(input);

    expect(IntegerParser.parse.calledOnceWith(input)).to.equal(true);
    expect(rpn.stack[0]).to.equal(parsed);
  });

  it('Should use IntegerParser for all numbers.', () => {
    sandbox.stub(IntegerParser, 'parse');
    const inputs = chance.unique(() => chance.integer().toString(), chance.d12());
    const parsedNums = inputs.map(() => chance.integer());

    inputs.forEach((input, index) => {
      const parsed = parsedNums[index];
      IntegerParser.parse.withArgs(input).returns(parsed);
      rpn.enter(input);
    });

    expect(IntegerParser.parse.callCount).to.equal(inputs.length);
    inputs.forEach(input => expect(IntegerParser.parse.calledWith(input)).to.equal(true));
    expect(rpn.stack).to.have.ordered.members(parsedNums);
  });

  it('Should throw error on unknown input.', () => {
    expect(() => rpn.enter(chance.first())).to.throw();
  });

  describe('Addition', () => {
    it('Should throw error if too few elements on stack.', () => {
      expect(() => rpn.enter('+')).to.throw();
      
      rpn.enter(chance.integer().toString());
      expect(() => rpn.enter('+')).to.throw();
    });

    it('Should perform addition.', () => {
      const numsOnStack = chance.integer({max: 5, min: 2});
      const nums = chance.n(chance.integer, numsOnStack, INT_RANGE);
      const num1 = nums[nums.length - 2];
      const num2 = nums[nums.length - 1];

      nums.forEach((value) => rpn.enter(value));
      rpn.enter('+');

      const stack = rpn.stack;
      expect(stack.length).to.equal(numsOnStack - 1);
      expect(stack[stack.length - 1]).to.equal(num1 + num2);
    });
  });

  describe('Multiplication', () => {
    it('Should throw error if too few elements on stack.', () => {
      expect(() => rpn.enter('*')).to.throw();
      
      rpn.enter(chance.integer().toString());
      expect(() => rpn.enter('*')).to.throw();
    });

    it('Should perform multiplication.', () => {
      const numsOnStack = chance.integer({max: 5, min: 2});
      const nums = chance.n(chance.integer, numsOnStack, INT_RANGE);
      const num1 = nums[nums.length - 2];
      const num2 = nums[nums.length - 1];

      nums.forEach((value) => rpn.enter(value));
      rpn.enter('*');

      const stack = rpn.stack;
      expect(stack.length).to.equal(numsOnStack - 1);
      expect(stack[stack.length - 1]).to.equal(num1 * num2);
    });
  });
});
