let training_data = [
  {
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

let population;
let p;
const width = 800;
const height = 800;
const radius = 40;

const options = {
  context: {
    data: training_data
  },
  size: 2,
  mutation: {
    rate: 0.01,
    allowed: mutation.ALL,
  },
  crossover: {
    rate: 0.5,
  },
  elitism: 0.01
};

function setup() {
  createCanvas(width, height)
  population = new Population(XoR, options);
  p = createP();
  noLoop();
}

function draw() {
  background(0);
  population.nextGeneration();
  if (population.best.score === 1000) {
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