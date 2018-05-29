let population;
let bestPhrase;
let allPhrases;
let stats;

const phrase = 'To be or not to be, this is the question.';

const options = {
  context: {
    data: phrase
  },
  size: 200,
  mutation: {
    rate: 0.01,
  },
  crossover: {
    rate: 0.5,
  },
  elitism: 0.01
};

const display = () => {
  // Display current status of population
  let answer = population.getBest() ? population.getBest().dna.map(e => String.fromCharCode(e)).join('') : 0;

  bestPhrase.html("Best phrase:<br>" + answer);

  let statstext = "total generations:     " + population.getGeneration() + "<br>";
  statstext += "average fitness:       " + Math.floor(population.getAverageScore() * 100 / phrase.length) + "%<br>";
  statstext += "total population:      " + population.getSize() + "<br>";
  statstext += "mutation rate:         " + floor(options.mutation.rate * 100) + "%<br>";
  statstext += "crossover rate:         " + floor(options.crossover.rate * 100) + "%<br>";
  statstext += "elitism:         " + floor(options.elitism * 100) + "%";

  stats.html(statstext); 

  allPhrases.html("All phrases:<br>" + population.population.slice(0, 50).map(agent => agent.dna.map(e => String.fromCharCode(e)).join('')).join('<br />'));
}


function setup() {
  bestPhrase = createP("Best phrase:");
  bestPhrase.class("best");

  allPhrases = createP("All phrases:");
  allPhrases.position(800, 10);
  allPhrases.class("all");

  stats = createP("Stats");
  stats.class("stats");

  population = new Population(Guesser, options);
}

function draw() {
  population.nextGeneration();
  if (population.getBest().score === phrase.length) {
    noLoop();
  }

  display();
}
