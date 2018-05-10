let gaussianRandom = () => {
  return Array(100).fill(Math.random()).reduce((acc, e) => acc + e, 0) / 100;
};

let randomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(gaussianRandom() * (max - min)) + min;
};

let randomFloat = (min, max) => gaussianRandom() * (max - min) + min;

let random = (dataset) => {
  let index = randomInt(0, dataset.length);
  return dataset[index];
};

if (typeof module !== 'undefined') {
  module.exports.gaussianRandom = gaussianRandom;
  module.exports.randomInt = randomInt;
  module.exports.random = random;
};