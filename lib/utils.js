const randomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

const randomFloat = (min, max) => Math.random() * (max - min) + min;

const randomFrom = (dataset) => {
  if (dataset instanceof Array) {
    let index = randomInt(0, dataset.length);
    return dataset[index];
  } else if (typeof dataset === 'object') {
    let index = randomInt(0, Object.keys(dataset).length);
    return dataset[Object.keys(dataset)[index]];
  }
};

if (typeof module !== 'undefined') {
  module.exports.randomInt = randomInt;
  module.exports.randomFrom = randomFrom;
};