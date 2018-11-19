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


let network, agent;
const width = 600;
const height = 600;
const radius = 40;
let count = 0;
let p;

function setup() {
  createCanvas(width, height)
  network = new NeuralNetwork([2, 3, 1]);
  
  network.setLearningRate(0.3);
  network.setActivationFunction(activation.TANH);
  p = createP();
}

function draw() {
  background(0);
  let data = random(training_data);
  network.train(data.inputs, data.outputs);
  count++;
  if (count === 1000) {
    noLoop();
    console.log('done');
  }
  p.html(`Iteration: ${count}`);
  drawNeuralNetwork(0, 0, width, height, radius, network);
}
