let nn = new NeuralNetwork([2, 3, 1]);

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

nn.setLearningRate(0.3);

for (let i = 0; i < 100000; i++) {
  let data = random(training_data);
  nn.train(data.inputs, data.outputs);
}
console.log('done learning');
