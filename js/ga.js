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

class XoR extends Individual {
  constructor() {
    super(new NeuralNetwork([2,3,3,1]).setLearningRate(0.3).setActivationFunction(sigmoid));
  }

  evolve(trainingSet, maxIterations, maxAllowedMistakes) {
    let mistakes = -1;
    for (let i = 0; i < maxIterations; i++) {
      let data = random(training_data);
      this.brain.train(data.inputs, data.outputs);
    }
    for (let i = 0; i < maxIterations / 2; i++) {
      let data = random(training_data);
      const output = this.brain.predict(data.inputs)[0];
      if (Math.round(output) === data.outputs[0]) {
        this.score++;
      } else {
        mistakes++;
      }
      if (mistakes === maxAllowedMistakes) {
        this.die();
        break;
      }
    }
  }
};

const p = new Population(XoR, 500, 0.3, 0.1);
