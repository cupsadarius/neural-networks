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

const context = {
  data: training_data
};

let population;
let p;
const width = 800;
const height = 800;
const radius = 40;

function setup() {
  createCanvas(width, height)
  population = new Population(XoR, context, 500, 0.4, 0.1);
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