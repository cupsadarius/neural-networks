class Phenotype {

  constructor(dna) {
    this.score = 0;
    this.fitness = 0;
    this.dna = dna;
    this.generation = 0;
    this.index = 0;
    this.species = dna.nodes.join('-');
  }

  setDeathHandler(handler) {
    this.onDeath = handler;
    return this;
  }

  die() {
    this.onDeath(this);
  }

  mutate(mutationRate) {
    this.dna.mutate((e) => {
      const offset = Math.random() < mutationRate ? Array(6).fill(Math.random()).reduce((acc, e) => acc + e, 0) / 6 * 0.5 : 0;
      return e + offset;
    });

    return this;
  }

  copy() {
    return new this.constructor(this.brain).setDeathHandler(this.onDeath.bind(this));
  }

  evaluate(context) {
    throw new Error('This should be implemented in the child class.');
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