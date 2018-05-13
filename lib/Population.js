class Population {
  constructor(agent, context, size, crossoverRate, mutationRate, structuralOptions) {
    this.best = null;
    this.size = size;
    this.mutationRate = mutationRate;
    this.structuralOptions = structuralOptions;
    this.crossoverRate = crossoverRate;
    this.population = [];
    this.previousPopulation = [];
    this.agent = agent;
    this.context = context;
    this.species = {}
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
      this.species[this.best.species] = this.species[this.best.species] ? this.species[this.best.species] + 1 : 1;
      // uncoment this if you want infinite evolution
      // this.nextGeneration();
    }
  }

  getGeneration() {
    return this.best ? this.best.generation : 1;
  }

  getSize() {
    return this.size;
  }

  getAverageFitness() {
    return this.averageFitness;
  }

  getAverageScore() {
    return this.averageScore;
  }

  getBestOverall() {
    return this.bestOverall;
  }

  getBest() {
    return this.best;
  }

  nextGeneration() {
    this.best = null;
    this.averageFitness = 0;
    this.averageScore = 0;

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
      const father = this.poolSelection(mother.species) || mother;

      population[index] = this.agent
        .crossover(mother, father, this.crossoverRate)
        .mutate(this.mutationRate, this.structuralOptions);
      population[index].generation = this.previousPopulation[index].generation + 1;
      population[index].index = parseInt(index);
    }
    
    this.population = population;
  }

  normalizeFitness() {
    let sum = 0;
    for (let index in this.previousPopulation) {
      this.averageScore += this.previousPopulation[index].score;
      this.previousPopulation[index].score = Math.exp(this.previousPopulation[index].score);
      sum += this.previousPopulation[index].score;
    }

    for (let index in this.previousPopulation) {
      this.previousPopulation[index].fitness = this.previousPopulation[index].score / sum;
      this.averageFitness += this.previousPopulation[index].fitness;
    }

    this.averageFitness /= this.size;
    this.averageScore /= this.size;
  }


 
  poolSelection(species) {
    // Start at 0
    let index = 0;

    const sameSpecies = this.previousPopulation.filter(phenotype => species ? phenotype.species === species : true);

    if (!sameSpecies.length) {
      return null;
    }

    // Pick a random number between 0 and 1
    let r = Math.random(1);

    // Keep subtracting probabilities until you get less than zero
    // Higher probabilities will be more likely to be fixed since they will
    // subtract a larger number towards zero
    while (r > 0) {
      r -= sameSpecies[index].fitness;
      // And move on to the next
      index = (index + 1) % sameSpecies.length;
    }

    // Go back one
    index = index === 0 ? sameSpecies.length - 1 : index - 1;

    return sameSpecies[index].copy();
  }
};

if (typeof module !== 'undefined') {
  module.exports = Population;
}