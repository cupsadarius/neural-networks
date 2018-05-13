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
    
    this.score = weight * error;
    this.die();
    return;
  }
};
