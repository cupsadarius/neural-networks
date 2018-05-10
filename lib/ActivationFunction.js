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

const arctan = new ActivationFunction(
  x => Math.pow(Math.atan(x), -1),
  y => 1 / (Math.pow(y) + 1)
);

const softsign = new ActivationFunction(
  x => x / (1 + Math.abs(x)),
  y => 1 / Math.pow(1 + Math.abs(y), 2)
);

const ReLU = new ActivationFunction(
  x => x < 0 ? 0 : x,
  y => y < 0 ? 0 : 1
);

if (typeof module !== 'undefined') {
  module.exports = ActivationFunction;
  module.exports.sigmoid = sigmoid;
  module.exports.tanh = tanh;
  module.exports.arctan = arctan;
  module.exports.softsign = softsign;
  module.exports.ReLU = ReLU;
};