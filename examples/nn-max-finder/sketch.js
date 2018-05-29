let training_data = Array(10000);

training_data = training_data.fill(0).map(() => {
  const inputs = [];
  inputs[0] = randomInt(0, 100);
  inputs[1] = randomInt(0, 100);
  inputs[2] = randomInt(0, 100);
  const max = inputs.reduce((max, e) => e > max ? e : max, 0);
  let outputs = [inputs.indexOf(max) === 0 ? -1 : inputs.indexOf(max) === 1 ? 0 : 1];

  return {
    inputs,
    outputs
  };
});


let network;
const width = 600;
const height = 600;
const radius = 40;
let count = 0;
let p;

function setup() {
createCanvas(width, height)
network = new NeuralNetwork([3, 3, 1]);

network.setLearningRate(0.01);
network.setActivationFunction(activation.SIGMOID);

p = createP();
}

function draw() {
background(0);
let data = training_data[count];
network.train(data.inputs, data.outputs);
count++;
if (count === training_data.length) {
  noLoop();
  console.log('done');
}
p.html(`Iteration: ${count}`);
drawNeuralNetwork(0, 0, width, height, radius, network);
}
