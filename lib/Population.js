class Population {
  constructor(initialPopulation) {
    this.counter = 0;
    this.best = null;
    this.population = initialPopulation;
  }

  reset() {
    this.counter = 0;
    this.best = null;
  }

  nextGeneration() {
    this.reset();

    this.population = this.normalizeFitness(this.population);

    this.population = this.generate(this.population);
  }

  generate(previousPopulation) {
    let population = [];
    for (let index in previousPopulation) {
      population[index] = this.poolSelection(previousPopulation);
    }
    
    return population;
  }

  normalizeFitness(population) {
    // Make score exponentially better?
    for (let i = 0; i < population.length; i++) {
      population[i].score = Math.pow(population[i].score, 2);
    }

    // Add up all the score
    let sum = 0;
    for (let i = 0; i < population.length; i++) {
      sum += population[i].score;
    }
    // Divide by the sum
    for (let i = 0; i < population.length; i++) {
      population[i].fitness = population[i].score / sum;
    }

    return population;
  }

  poolSelection(population) {
    // Start at 0
    let index = 0;

    // Pick a random number between 0 and 1
    let r = Math.random(1);

    // Keep subtracting probabilities until you get less than zero
    // Higher probabilities will be more likely to be fixed since they will
    // subtract a larger number towards zero
    while (r > 0) {
      r -= population[index].fitness;
      // And move on to the next
      index += 1;
    }

    // Go back one
    index -= 1;
    // Make sure it's a copy!
    // (this includes mutation)
    return population[index].copy();
  }
};