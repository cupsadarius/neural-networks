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


let population;
let p;
const width = 800;
const height = 800;
const radius = 40;

const options = {
  context: {
    data: data
  },
  size: 10,
  mutation: {
    rate: 0.01,
    allowed: mutation.FFW,
    options: {
      maxHiddenLayers: 3,
      maxNodesOnHiddenLayer: 5,
    }
  },
  crossover: {
    rate: 0.5,
  },
  elitism: 0.01
};

function setup() {
  createCanvas(width, height)
  population = new Population(MaxFinder, options);
  p = createP();
  noLoop();
}

function draw() {
  background(0);
  population.nextGeneration();
  if (population.getBest().score === 500) {
    noLoop();
    console.log('done');
  }
  p.html(`Generation: ${population.getGeneration()}, Best Score: ${population.getBest().score}, Average Score: ${population.getAverageScore()}`);

  textSize(32);
  fill(255);

  text(`Best Overall ${population.getBest().score}`, width / 4, 50);
  drawNeuralNetwork(0, 0, width, height / 2, radius, population.getBest().dna);
  
  text(`Generation best ${population.getCurrentBest().score}`, width / 4, height / 2 + 50);
  drawNeuralNetwork(0, height / 2, width, height / 2, radius, population.getCurrentBest().dna);
}
