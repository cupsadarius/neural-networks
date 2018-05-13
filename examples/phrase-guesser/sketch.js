let population;
let size = 200;
let mutationRate = 0.01;
let bestPhrase;
let allPhrases;
let stats;
const phrase = 'To be or not to be, this is the question.';


const display = () => {
  // Display current status of population
  let answer = population.getBest().dna.map(e => String.fromCharCode(e)).join('');

  bestPhrase.html("Best phrase:<br>" + answer);

  let statstext = "total generations:     " + population.getGeneration() + "<br>";
  statstext += "average fitness:       " + Math.floor(population.getAverageScore() * 100 / phrase.length) + "%<br>";
  statstext += "total population:      " + population.getSize() + "<br>";
  statstext += "mutation rate:         " + floor(mutationRate * 100) + "%";

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

  population = new Population(Guesser, {data: phrase}, 500, 0.5, mutationRate);
}

function draw() {
  population.nextGeneration();
  if (population.bestOverall.score === phrase.length) {
    noLoop();
  }

  display();
}
