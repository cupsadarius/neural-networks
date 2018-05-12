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

class AvoidColision extends NeuralAgent {
  constructor(dna) {
    super(dna || new NeuralNetwork([3,1]).setActivationFunction(softsign));
  }

  evaluate(context) {
    let run = true;
    do {
      const thought = random(context.data);
      const result = this.think(thought.inputs);
      if (Math.round(result[0]) === thought.outputs[0]) {
        this.score++;
      } else {
        run = false;
      }
    } while (run);
    
    this.die();
    return;
  }
};

const context = {
  data
};
const structuralOptions = {
  layerMutationRate: 0.05,
  decreaseLayerRate: 0.01,
  nodeMutationRate: 0.05,
  maxHiddenLayers: 3,
  maxNodesOnHiddenLayer: 7
};

let population;
let p;
const width = 800;
const height = 800;
const radius = 40;

function setup() {
  createCanvas(width, height)
  population = new Population(AvoidColision, context, 200, 0.5, 0.05, structuralOptions);
  p = createP();
}

function draw() {
  background(0);
  population.nextGeneration();
  if (population.bestOverall === 100) {
    noLoop();
    console.log('done');
  }
  p.html(`Generation: ${population.getGeneration()}, Best Score: ${population.getBestOverall().score}`);

  textSize(32);
  fill(255);

  text(`Best Overall ${population.getBestOverall().score}`, width / 4, 50);
  drawNeuralNetwork(0, 0, width, height / 2, radius, population.getBestOverall().dna);
  
  text(`Generation best ${population.getBest().score}`, width / 4, height / 2 + 50);
  drawNeuralNetwork(0, height / 2, width, height / 2, radius, population.getBest().dna);
}

const drawNeuralNetwork = (minWidth, minHeight, maxWidth, maxHeight, radius, network) => {
  let nodes = network.nodes.map(count => Array(count));
  for (let i = 0; i < nodes.length; i++) {
    for (let j = 0; j < nodes[i].length; j++) {
      nodes[i][j] = createVector(minWidth + (i + 1) * (maxWidth) / (nodes.length + 1), minHeight + (j + 1) * (maxHeight) / (nodes[i].length + 1));
    }
  }
  for (let i = 0; i < nodes.length - 1; i++) {
    for (let j = 0; j < nodes[i].length; j++) {
      for (let k = 0; k < nodes[i+1].length; k++) {
        stroke(255);
        strokeWeight(Math.abs(network.weights[i].data[k][j]));
        line(nodes[i][j].x, nodes[i][j].y, nodes[i + 1][k].x, nodes[i + 1][k].y);
      }
    }
  }

  stroke(255);
  for (let i = 0; i < nodes.length; i++) {
    for (let j = 0; j < nodes[i].length; j++) {
      ellipse(nodes[i][j].x, nodes[i][j].y, radius, radius);
    }
  }
}