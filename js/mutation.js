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
const structuralOptions = {
  layerMutationRate: 0.1,
  nodeMutationRate: 0.1,
  maxHiddenLayers: 4,
  maxNodesOnHiddenLayer: 5
};
const p = new Population(XoR, context, 100, 0.5, 0.1, structuralOptions);

p.bestOverall = {score: 0};
while (p.bestOverall.score < 20) {
  p.nextGeneration();
  console.log(p.bestOverall.score, p.bestOverall.species);
}
console.log('done');