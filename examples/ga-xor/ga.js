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


class XoR extends NeuralAgent {
  constructor(dna) {
    super(dna || new NeuralNetwork([2,3,1]));
  }

  evaluate(context) {
    let run = true;
    let shouldBeFalse = 0;
    let shouldBeTrue = 0;
    let error = 0;
    do {
      const thought = randomFrom(context.data);
      const result = this.think(thought.inputs);
      const inputSum = thought.inputs[0] + thought.inputs[1];

      if (Math.round(result[0]) === thought.outputs[0]) {
        if (inputSum === 0 || inputSum === 2) {
          shouldBeFalse += 1;
        } else {
          shouldBeTrue += 1;
        }

        error += Math.pow(result[0] - thought.outputs[0], 2);
      } else {
        run = false;
      }
    } while (run);
    const weight = shouldBeFalse && shouldBeTrue ? ((shouldBeFalse / shouldBeTrue) / (shouldBeFalse + shouldBeTrue)) : 0;
    // console.log(this.generation, this.index, [shouldBeFalse, shouldBeTrue], weight, error);
    
    this.score = weight * error;
    this.die();
    return;
  }
};

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