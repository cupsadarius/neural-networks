class Population {
  constructor(instantiator, size, mutationRate, toBeRandomized) {
    this.best = null;
    this.mutationRate = mutationRate;
    this.population = [];
    this.previousPopulation = [];
    this.toBeRandomized = toBeRandomized;
    this.instantiator = instantiator;
    for (let i = 0; i < size; i++) {
      this.population[i] = new instantiator().setDeathHandler(this.onDeath.bind(this));
      this.population[i].generation = 0;
      this.population[i].index = 0;
    }
  }

  onDeath(individual) {
    this.previousPopulation.push(individual);
    const copy = individual.copy();
    copy.score = individual.score;
    copy.generation = individual.generation;
    copy.index = individual.index;
    this.best = this.best ? this.best.score > copy.score ? this.best : copy : copy;
    this.bestOverall = this.bestOverall ? this.bestOverall.score > this.best.score ? this.bestOverall : this.best : this.best;

    if (this.previousPopulation.length === this.population.length) {
      console.log(this.best);
      this.nextGeneration();
    }
  }

  nextGeneration() {
    this.best = null;

    this.normalizeFitness();

    this.generate();

    this.previousPopulation = [];
  }

  generate() {
    let population = [];
    
    for (let index in this.population) {
      population[index] = index > this.population.length * this.toBeRandomized ? new this.instantiator().setDeathHandler(this.onDeath.bind(this)) : this.poolSelection();
      population[index].generation = this.previousPopulation[index].generation + 1;
      population[index].index = parseInt(index);
    }
    
    this.population = population;
  }

  evolve(trainingSet, maxAttempts, maxAllowedMistakes) {
    for (const individual of this.population) {
      individual.evolve(training_data, maxAttempts, maxAllowedMistakes);
    }
  }

  normalizeFitness() {
    for (let index in this.previousPopulation) {
      const scaled = Math.pow(this.previousPopulation[index].score, 2);
      this.previousPopulation[index].score = scaled;
    }
    
    // Add up all the score
    let sum = 0;
    for (let i = 0; i < this.previousPopulation.length; i++) {
      sum += this.previousPopulation[i].score;
    }
    // Divide by the sum
    for (let i = 0; i < this.previousPopulation.length; i++) {
      this.previousPopulation[i].fitness = this.previousPopulation[i].score / sum;
    }
  }

  poolSelection() {
    // Start at 0
    let index = 0;

    // Pick a random number between 0 and 1
    let r = Math.random(1);

    // Keep subtracting probabilities until you get less than zero
    // Higher probabilities will be more likely to be fixed since they will
    // subtract a larger number towards zero
    while (r > 0) {
      r -= this.previousPopulation[index].fitness;
      // And move on to the next
      index += 1;
    }

    // Go back one
    index -= 1;
    return this.previousPopulation[index].copy().mutate(this.mutationRate);
  }
};

if (typeof module !== 'undefined') {
  module.exports = Population;
}