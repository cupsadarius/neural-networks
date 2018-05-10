class Population {
  constructor(agent, size, mutationRate, crossoverRate, context) {
    this.best = null;
    this.mutationRate = mutationRate;
    this.crossoverRate = crossoverRate;
    this.population = [];
    this.previousPopulation = [];
    this.agent = agent;
    this.context = context;

    for (let i = 0; i < size; i++) {
      this.population[i] = new agent().setDeathHandler(this.onDeath.bind(this));
      this.population[i].generation = 0;
      this.population[i].index = i;
    }

    this.evaluatePopulation();
  }

  onDeath(individual) {
    this.previousPopulation.push(individual);
    const copy = individual.copy();
    copy.score = individual.score;
    copy.generation = individual.generation;
    copy.index = individual.index;
    this.best = this.best ? this.best.score > copy.score ? this.best : copy : copy;
    this.bestOverall = this.bestOverall ? this.bestOverall.score > copy.score ? this.bestOverall : copy : copy;

    if (this.previousPopulation.length === this.population.length) {
      // uncoment this if you want infinite evolution
      // this.nextGeneration();
    }
  }

  nextGeneration() {
    this.best = null;

    this.normalizeFitness();

    this.generate();

    this.previousPopulation = [];

    this.evaluatePopulation();
  }

  evaluatePopulation() {
    for (let agent of this.population) {
      agent.evaluate(this.context);
    }
  }

  generate() {
    let population = [];
    
    for (let index in this.population) {
      const mother = this.poolSelection();
      const father = this.poolSelection(mother.species);

      population[index] = this.agent.crossover(mother, father, this.crossoverRate).mutate(this.mutationRate);
      population[index].generation = this.previousPopulation[index].generation + 1;
      population[index].index = parseInt(index);
    }
    
    this.population = population;
  }

  normalizeFitness() {
    let sum = 0;
    for (let index in this.previousPopulation) {
      this.previousPopulation[index].score = Math.exp(this.previousPopulation[index].score);
      sum += this.previousPopulation[index].score;
    }

    for (let index in this.previousPopulation) {
      this.previousPopulation[index].fitness = this.previousPopulation[index].score / sum;
    }
  }
 
  poolSelection(species) {
    // Start at 0
    let index = 0;

    const sameSpecies = this.previousPopulation.filter(phenotype => species ? phenotype.species === species : true);
    // Pick a random number between 0 and 1
    let r = Math.random(1);

    // Keep subtracting probabilities until you get less than zero
    // Higher probabilities will be more likely to be fixed since they will
    // subtract a larger number towards zero
    while (r > 0) {
      r -= sameSpecies[index].fitness;
      // And move on to the next
      index += 1;
    }

    // Go back one
    index -= 1;

    return sameSpecies[index].copy();
  }
};

if (typeof module !== 'undefined') {
  module.exports = Population;
}