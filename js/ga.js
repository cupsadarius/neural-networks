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


let data = [];
for (let i = 0; i < 10; i++) {
  data = data.concat(training_data);
}

class XoR extends Phenotype {
  constructor() {
    super(new NeuralNetwork([2,3,3,1]).setLearningRate(0.3).setActivationFunction(sigmoid));
  }

  evaluate(context) {
    let run = true;
    let shouldBeFalse = 0;
    let shouldBeTrue = 0;
    let error = 0;
    do {
      const thought = random(context.data);
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
  data
};

const p = new Population(XoR, 100, 0.2, 0.4, context);

for (let i = 0; i < 100; i++) {
  p.nextGeneration();
}
console.log('done evolving');