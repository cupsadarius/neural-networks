class NeuralAgent extends Agent {

  constructor(dna) {
    super(dna);
    this.species = dna.nodes.join('-');
  }

  mutate(mutationRate) {
    this.dna.mutate((e) => {
      const offset = Math.random() < mutationRate ? Array(6).fill(Math.random()).reduce((acc, e) => acc + e, 0) / 6 * 0.5 : 0;
      return e + offset;
    });

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