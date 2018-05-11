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
  maxNodesOnHiddenLayer: 5
};
const p = new Population(AvoidColision, context, 200, 0.5, 0.05, structuralOptions);

p.bestOverall = {score: 0};
while (p.bestOverall.score < 100) {
  p.nextGeneration();
  console.log(p.bestOverall.score, p.bestOverall.species);
}
console.log('done', p.bestOverall);