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


let network;
const width = 600;
const height = 600;
const radius = 40;
let count = 0;
let p;
function setup() {
  createCanvas(width, height)
  network = new NeuralNetwork([2, 3, 1]);
  
  network.setLearningRate(0.3);

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