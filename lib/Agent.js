class Agent {
  constructor(dna) {
    this.score = 0;
    this.fitness = 0;
    this.generation = 0;
    this.index = 0;
    this.dna = dna;
  }

  setDeathHandler(handler) {
    this.onDeath = handler;
    return this;
  }

  die() {
    this.onDeath(this);
  }

  copy() {
    return new this.constructor(this.dna).setDeathHandler(this.onDeath.bind(this));
  }
  
  evaluate(context) {
    throw new Error('This should be implemented in the child class.');
  }

  mutate(mutation) {
    throw new Error('This should be implemented in the child class.');
  }

  crossover(a, b, crossover) {
    throw new Error('This should be implemented in the child class.');
  }
}