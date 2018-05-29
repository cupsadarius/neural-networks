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

  mutate({rate, allowed}) {
    let dna = this.dna.copy();
    if (Math.random() < rate) {
      const mutation = randomFrom(allowed);
      console.log(mutation);
      switch(mutation.name) {
        case 'ADD_NODE': {
          const shouldAddLayer = dna.nodes.length === 2;

          break;
        }
        case 'SUB_NODE': {

          break;
        }
        case 'ADD_LAYER': {

          break;
        }
        case 'SUB_LAYER': {

          break;
        }
        case 'MOD_WEIGHT': {
          let i = randomInt(0, dna.weights.length);
          let j = randomInt(0, dna.weights[i].data.length);
          let k = randomInt(0, dna.weights[i].data[j].length);
          dna.weights[i].data[j][k] += randomFloat(mutation.min, mutation.max);
          console.log(`mutating weight matrix ${i} at [${j}][${k}] += ${dna.weights[i].data[j][k]}`);
          break;
        }
        case 'MOD_BIAS': {
          let i = randomInt(0, dna.bias.length);
          let j = randomInt(0, dna.bias[i].data.length);
          dna.bias[i].data[j][0] += randomFloat(mutation.min, mutation.max);
          console.log(`mutating bias matrix ${i} at [${j}][${0}] = ${dna.bias[i].data[j][0]}`);
          break;
        }
        case 'MOD_ACTIVATION': {
          let i = randomInt(0, mutation.mutateOutput ? dna.activation.length : dna.activation.length - 1);
          let j = randomInt(0, dna.activation[i].length);
          dna.activation[i][j] = randomFrom(mutation.allowed);
          dna.activationMap[i][j] = dna.activation[i][j].toString();
          console.log(`mutating activation matrix [${i}][${j}] = ${dna.activationMap[i][j]}`);
          break;
        }
        default: {
          console.warn(`Mutation: ${mutation.name} not supported`);
        }
      }

      this.dna = dna;
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