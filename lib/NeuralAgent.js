class NeuralAgent extends Agent {

  constructor(dna) {
    super(dna);
    this.species = dna.nodes.join('-');
  }

  mutate(mutationRate, structuralOptions) {
    let dna = this.dna.copy();
    if (structuralOptions) {
      let nodes = [];
      if (Math.random() < structuralOptions.layerMutationRate) {
        const removeLayerPossible = dna.nodes.length > 2;
        const action = Math.round(randomFloat(-1, 1));
        if (removeLayerPossible && action === -1) {
          const layerToRemove = randomInt(1, dna.weights.length -1);
          nodes = [...dna.nodes.slice(0, layerToRemove), ...dna.nodes.slice(layerToRemove + 1, dna.nodes.length)];
        } else if (action === 1 && dna.nodes.length - 2 <= structuralOptions.maxHiddenLayers) {
          const position = randomInt(1, dna.weights.length);
          const nodesOnLayer = randomInt(1, dna.nodes.reduce((max, e) => e > max ? e : max, 0) + 1);
          nodes = [
            ...dna.nodes.slice(0, position),
            nodesOnLayer,
            ...dna.nodes.slice(position, dna.nodes.length)
          ];
        }
      }
  
      if (Math.random() < structuralOptions.nodeMutationRate && dna.nodes.length > 2) {
        const layerToChange = randomInt(1, dna.nodes.length - 1);
        const action = Math.round(randomFloat(-1, 1));
        nodes = dna.nodes.slice();
        nodes[layerToChange] = 
        nodes[layerToChange] + action > 0 && nodes[layerToChange] + action <= structuralOptions.maxNodesOnHiddenLayer ?
          nodes[layerToChange] + action :
          nodes[layerToChange];
      }
      
      dna = nodes.length ? new NeuralNetwork(nodes).setLearningRate(dna.learning_rate).setActivationFunction(dna.activation_function) : dna;
    }
    
    dna.mutate((e) => Math.random() < mutationRate ? (Array(10).fill(Math.random()).reduce((acc, e) => acc + e, 0) / 10) * 0.5 : e);
    this.dna = dna;

    this.species = this.dna.nodes.join('-');
    return this;
  }

  think(input) {
    return this.dna.predict(input);
  }

  static crossover(a, b, crossoverRate) {
    a.dna.weights = a.dna.weights.map((weightMatrix, index) => {
      return weightMatrix.map((e, i, j) => {
        const shouldCrossOver = crossoverRate < Array(6).fill(Math.random()).reduce((acc, e) => acc + e, 0) / 6;
        return shouldCrossOver ? b.dna.weights[index].data[i][j] : e;
      });
    });

    a.dna.bias = a.dna.bias.map((biasMatrix, index) => {
      return biasMatrix.map((e, i, j) => {
        const shouldCrossOver = crossoverRate < Array(6).fill(Math.random()).reduce((acc, e) => acc + e, 0) / 6;
        return shouldCrossOver ? b.dna.bias[index].data[i][j] : e;
      });
    });

    return a;
  }
}