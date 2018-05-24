// https://en.wikipedia.org/wiki/Activation_function
// https://stats.stackexchange.com/questions/115258/comprehensive-list-of-activation-functions-in-neural-networks-with-pros-cons
const activation = {
  LOGISTIC: (x, derivate) => {
    const fx = 1 / (1 + Math.exp(-x));
    
    return !derivate ? fx : fx * (1 - fx);
  },
  SIGMOID: (x, derivate) => derivate ? x * (1 - x) : 1 / (1 + Math.exp(-x)),
  TANH: (x, derivate) => derivate ? 1 - Math.pow(Math.tanh(x), 2) : Math.tanh(x),
  IDENTITY: (x, derivate) => derivate ? 1 : x,
  STEP: (x, derivate) => derivate ? 0 : x > 0 ? 1 : 0,
  RELU: (x, derivate) => derivate ? x > 0 ? 1 : 0 : x > 0 ? x : 0,
  SOFTSIGN: (x, derivate) => {
    const d = 1 + Math.abs(x);
    
    return derivate ? x / Math.pow(d, 2) : x / d;
  },
  SINUSOID: (x, derivate) => derivate ? Math.cos(x) : Math.sin(x),
  GAUSSIAN: (x, derivate) => {
    const d = Math.exp(-Math.pow(x, 2));
    
    return derivate ? -2 * x * d : d;
  },
  BENT_IDENTITY: (x, derivate) => {
    const d = Math.sqrt(Math.pow(x, 2) + 1);
    
    return derivate ? x / (2 * d) + 1 : (d - 1) / 2 + x;
  },
  BIPOLAR: (x, derivate) => derivate ? 0 : x > 0 ? 1 : -1,
  BIPOLAR_SIGMOID: (x, derivate) => {
    const d = 2 / (1 + Math.exp(-x)) - 1;
    
    return derivate ? 1 / 2 * (1 + d) * (1 - d) : d;
  },
  HARD_TANH: (x, derivate) => derivate ? x > -1 && x < 1 ? 1 : 0 : Math.max(-1, Math.min(1, x)),
  ABSOLUTE: (x, derivate) => derivate ? x < 0 ? -1 : 1 : Math.abs(x),
  INVERSE: (x, derivate) => derivate ? -1 : 1 - x,
  // https://arxiv.org/pdf/1706.02515.pdf
  SELU: (x, derivate) => {
    const alpha = 1.6732632423543772848170429916717;
    const scale = 1.0507009873554804934193349852946;
    const fx = x > 0 ? x : alpha * Math.exp(x) - alpha;
    
    return derivate ? x > 0 ? scale : (fx + alpha) * scale : fx * scale;
  }
};

/* Export */

if (typeof module !== 'undefined') {
  module.exports = activation;
};