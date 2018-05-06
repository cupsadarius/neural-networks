let nn = new NeuralNetwork([2, 3, 4, 3, 1]);

let training_data = [{
    inputs: [0, 0],
    outputs: [0]
  },
  {
    inputs: [0, 1],
    outputs: [1]
  },
  {
    inputs: [1, 0],
    outputs: [1]
  },
  {
    inputs: [1, 1],
    outputs: [0]
  }
];

let randomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

let random = (dataset) => {
  let index = randomInt(0, dataset.length);
  return dataset[index];
} 

nn.setLearningRate(0.3);

for (let i = 0; i < 100000; i++) {
  let data = random(training_data);
  nn.train(data.inputs, data.outputs);
}
console.log('done learning');
