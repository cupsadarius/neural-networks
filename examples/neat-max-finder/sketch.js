let data = Array(10000);

data = data.fill(0).map(() => {
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

const context = {
  data
};
const structuralOptions = {
  layerMutationRate: 0.05,
  decreaseLayerRate: 0.01,
  nodeMutationRate: 0.05,
  maxHiddenLayers: 2,
  maxNodesOnHiddenLayer: 5
};

let population;
let p;
const width = 800;
const height = 800;
const radius = 40;

function setup() {
  createCanvas(width, height)
  population = new Population(MaxFinder, context, 100, 0.5, 0.01, structuralOptions);
  p = createP();
}

function draw() {
  background(0);
  population.nextGeneration();
  if (population.bestOverall === 100) {
    noLoop();
    console.log('done');
  }
  p.html(`Generation: ${population.getGeneration()}, Best Score: ${population.getBestOverall().score}, Average Score: ${population.getAverageScore()}`);

  textSize(32);
  fill(255);

  text(`Best Overall ${population.getBestOverall().score}`, width / 4, 50);
  drawNeuralNetwork(0, 0, width, height / 2, radius, population.getBestOverall().dna);
  
  text(`Generation best ${population.getBest().score}`, width / 4, height / 2 + 50);
  drawNeuralNetwork(0, height / 2, width, height / 2, radius, population.getBest().dna);
}