class MaxFinder extends NeuralAgent {
  constructor(dna) {
    super(dna || new NeuralNetwork([3,1]).setActivationFunction(tanh));
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