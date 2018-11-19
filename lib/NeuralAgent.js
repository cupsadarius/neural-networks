if (typeof module !== 'undefined') {
  const Agent = require('./Agent');
  const activation = require('./activation');
  const {randomInt, randomFloat, randomFrom} = require('./utils');
}

class NeuralAgent extends Agent {

  constructor(dna) {
    super(dna);
    this.species = dna.nodes.join('-');
  }

  calibrateWeights(nodes, weights) {
    for (let i = 1; i < nodes.length; i ++) {
      if (weights[i - 1].cols < nodes[i - 1]) {
        // console.log('add column', weights[i - 1].cols, nodes[i - 1], nodes[i - 1] - weights[i - 1].cols);
        for (let j = 0; j <= nodes[i - 1] - weights[i - 1].cols; j++) {
          weights[i - 1].addColumn(j);
        }
      } else if (weights[i - 1].cols > nodes[i - 1]) {
        // console.log('remove column', weights[i - 1].cols, nodes[i - 1], weights[i - 1].cols - nodes[i - 1]);
        for (let j = 0; j <= weights[i - 1].cols - nodes[i - 1]; j++) {
          weights[i - 1].removeColumn(j);
        }
      }
      if (weights[i - 1].rows < nodes[i]) {
        // console.log('add row', weights[i - 1].rows, nodes[i], nodes[i] - weights[i - 1].rows);
        for (let j = 0; j <= nodes[i] - weights[i - 1].rows; j++) {
          weights[i - 1].addRow(j);
        }
      } else if (weights[i - 1].rows > nodes[i]) {
        // console.log('remove row', weights[i - 1].rows, nodes[i], weights[i - 1].rows - nodes[i]);
        for (let j = 0; j <= weights[i - 1].rows - nodes[i]; j++) {
          weights[i - 1].removeRow(j);
        }
      }
    }
    return weights;
  }

  mutate({rate, allowed, options}) {
    let dna = this.dna.copy();
    let mutation;
    try {

      if (Math.random() < rate) {
        mutation = randomFrom(allowed);
        // console.log(mutation);
        switch(mutation.name) {
          case 'ADD_NODE': {
            const index = randomInt(1, dna.nodes.length - 1);
            // console.log(`add node at ${index} from [${dna.nodes.join(', ')}]`);
            const nodes = dna.nodes;
            let weights = dna.weights;
            let bias = dna.bias;
            let act = dna.activation;
            let activationMap = dna.activationMap;
            if (nodes[index] < options.maxNodesOnHiddenLayer) {
              nodes[index] += 1;
              weights[index -  1].addRow(0);
              weights[index].addColumn(0);
              bias[index - 1] = bias[index - 1].addColumn();
              act[index - 1] = [...act[index - 1], randomFrom(activation)];
              activationMap[index - 1] = act[index - 1].map(a => a.toString());
            }
            dna.nodes = nodes;
            dna.weights = weights;
            dna.activation = act;
            dna.bias = bias;
            dna.activationMap = activationMap;
            console.log(dna);
            break;
          }
          case 'SUB_NODE': {
            const index = randomInt(1, dna.nodes.length - 1);
            // console.log(`Removing node at ${index} from [${dna.nodes.join(', ')}]`);
            const nodes = dna.nodes;
            let weights = dna.weights;
            let bias = dna.bias;
            let act = dna.activation;
            let activationMap = dna.activationMap;
            if (nodes[index] > 2) {
              nodes[index] -= 1;
              weights[index -  1].removeRow(0);
              weights[index].removeColumn(0);
              bias[index - 1] = bias[index - 1].removeRow();
              act[index - 1] = act[index - 1].pop()
              activationMap[index - 1] = activationMap[index - 1].pop();
            }
            dna.nodes = nodes;
            dna.weights = weights;
            dna.activation = act;
            dna.bias = bias;
            dna.activationMap = activationMap;
            break;
          }
          case 'ADD_LAYER': {
            if (dna.nodes.length - 2 < options.maxHiddenLayers) {
              const index = randomInt(1, dna.nodes.length - 1);
              const matrixIndex = index - 1;
              const nodes = [...dna.nodes.slice(0, index), randomInt(1, options.maxNodesOnHiddenLayer), ...dna.nodes.slice(index, dna.nodes.length)];
              // console.log(`Adding layer at ${index} with ${nodes[index]} nodes`);

              let weights = [
                ...dna.weights.slice(0, matrixIndex),
                (new Matrix(nodes[index], nodes[index - 1])).randomize(),
                ...dna.weights.slice(matrixIndex, dna.weights.length),
              ];
              const bias = [
                ...dna.bias.slice(0, matrixIndex),
                (new Matrix(nodes[index], 1)).randomize(),
                ...dna.bias.slice(matrixIndex, dna.bias.length)
              ];
              const act = [
                ...dna.activation.slice(0, matrixIndex),
                Array(nodes[index]).fill(0).map(() => randomFrom(activation)),
                ...dna.activation.slice(matrixIndex, dna.activation.length)
              ]
              const activationMap = [
                ...dna.activationMap.slice(0, matrixIndex),
                act[matrixIndex].map(a => a.toString()),
                ...dna.activationMap.slice(matrixIndex, dna.activationMap.length)
              ];

              

              dna.nodes = nodes;
              dna.weights = this.calibrateWeights(nodes, weights);
              dna.activation = act;
              dna.activationMap = activationMap;
              dna.bias = bias;
            }
            break;
          } 
          case 'SUB_LAYER': {
            if (dna.nodes.length > 2) {
              const index = randomInt(1, dna.nodes.length - 1);
              const matrixIndex = index - 1;
              const nodes = [...dna.nodes.slice(0, index), ...dna.nodes.slice(index + 1, dna.nodes.length)];
              // console.log(`Removing layer at ${index}`);

              let weights = [
                ...dna.weights.slice(0, matrixIndex),
                ...dna.weights.slice(matrixIndex + 1, dna.weights.length),
              ];
              const bias = [
                ...dna.bias.slice(0, matrixIndex),
                ...dna.bias.slice(matrixIndex + 1, dna.bias.length)
              ];
              const act = [
                ...dna.activation.slice(0, matrixIndex),
                ...dna.activation.slice(matrixIndex + 1, dna.activation.length)
              ]
              const activationMap = [
                ...dna.activationMap.slice(0, matrixIndex),
                ...dna.activationMap.slice(matrixIndex + 1, dna.activationMap.length)
              ];

              dna.nodes = nodes;
              dna.weights = this.calibrateWeights(nodes, weights);
              dna.activation = act;
              dna.activationMap = activationMap;
              dna.bias = bias;
            }
            break;
          }
          case 'MOD_WEIGHT': {
            let i = randomInt(0, dna.weights.length);
            let j = randomInt(0, dna.weights[i].data.length);
            let k = randomInt(0, dna.weights[i].data[j].length);
            dna.weights[i].data[j][k] += randomFloat(mutation.min, mutation.max);
            // console.log(`mutating weight matrix ${i} at [${j}][${k}] += ${dna.weights[i].data[j][k]}`);
            break;
          }
          case 'MOD_BIAS': {
            let i = randomInt(0, dna.bias.length);
            let j = randomInt(0, dna.bias[i].data.length);
            dna.bias[i].data[j][0] += randomFloat(mutation.min, mutation.max);
            // console.log(`mutating bias matrix ${i} at [${j}][${0}] = ${dna.bias[i].data[j][0]}`);
            break;
          }
          case 'MOD_ACTIVATION': {
            let i = randomInt(0, mutation.mutateOutput ? dna.activation.length : dna.activation.length - 1);
            let j = randomInt(0, dna.activation[i].length);
            dna.activation[i][j] = randomFrom(mutation.allowed);
            dna.activationMap[i][j] = dna.activation[i][j].toString();
            // console.log(`mutating activation matrix [${i}][${j}] = ${dna.activationMap[i][j]}`);
            break;
          }
          default: {
            console.warn(`Mutation: ${mutation.name} not supported`);
          }
        }

        this.dna = dna;
      }
    } catch (error) {
      console.log(error);
      console.log(mutation);
      console.log(dna);
      
    }
    this.species = this.dna.nodes.join('-');
    return this;
  }

  think(input) {
    return this.dna.predict(input);
  }

  static crossover(a, b, {rate}) {
    a.dna.weights = a.dna.weights.map((weightMatrix, index) => {
      return weightMatrix.map((e, i, j) => {
        const shouldCrossOver = rate < Array(6).fill(Math.random()).reduce((acc, e) => acc + e, 0) / 6;
        return shouldCrossOver ? b.dna.weights[index].data[i][j] : e;
      });
    });

    a.dna.bias = a.dna.bias.map((biasMatrix, index) => {
      return biasMatrix.map((e, i, j) => {
        const shouldCrossOver = rate < Array(6).fill(Math.random()).reduce((acc, e) => acc + e, 0) / 6;
        return shouldCrossOver ? b.dna.bias[index].data[i][j] : e;
      });
    });

    for (let i = 0; i < a.dna.activation.length; i++) {
      for (let j = 0; j < a.dna.activation[i].length; j++) {
        if (Math.random() < rate) {
          a.dna.activation[i][j] = b.dna.activation[i][j];
          a.dna.activationMap[i][j] = b.dna.activationMap[i][j];
        }
      }
    }

    return a;
  }
}

if (typeof module !== 'undefined') {
  module.exports = NeuralAgent;
}