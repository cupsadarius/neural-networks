class Individual {

  constructor(brain) {
    this.score = 0;
    this.fitness = 0;
    this.brain = brain;
  }

  setBrain(brain) {
    this.brain = brain;
    
    return this;
  }

  setDeathHandler(handler) {
    this.onDeath = handler;
    return this;
  }

  die() {
    this.onDeath(this);
  }

  mutate(mutationRate) {
    this.brain.mutate((e) => {
      const offset = Math.random() < mutationRate ? Array(6).fill(Math.random()).reduce((acc, e) => acc + e, 0) / 6 * 0.5 : 0;
      return e + offset;
    });

    return this;
  }

  copy() {
    return new this.constructor().setBrain(this.brain).setDeathHandler(this.onDeath.bind(this));
  }

}