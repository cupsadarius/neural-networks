class ActivationFunction {
  constructor(func, dfunc) {
    this.func = func;
    this.dfunc = dfunc;
  }
}

const sigmoid = new ActivationFunction(
  x => 1 / (1 + Math.exp(-x)),
  y => y * (1 - y)
);

const tanh = new ActivationFunction(
  x => Math.tanh(x),
  y => 1 - (y * y)
);

if (typeof module !== 'undefined') {
  module.exports = ActivationFunction;
  module.exports.sigmoid = sigmoid;
  module.exports.tanh = tanh;
};