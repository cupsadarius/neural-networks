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
};

let drawPopulation = (minWidth, minHeight, maxWidth, maxHeight, population) => {
  let populationMatrix = [];
  let scale = Math.floor((maxWidth - minWidth) / (maxHeight - minHeight));
  console.log(maxWidth - minWidth, maxHeight - minHeight, scale);
  for (let i = 0; i < scale; i++) {
    populationMatrix[i] = [];
    for (let j = 0; j < Math.floor(population.population.length / scale); j++) {
      console.log(i,j, (i + 1) * j + i);
      populationMatrix[i][j] = population.population[i * j];
    }
  }

  console.table(populationMatrix);
};

if (typeof module !== 'undefined') {
  module.exports.drawNeuralNetwork = drawNeuralNetwork;
  module.exports.drawPopulation = drawPopulation;
};