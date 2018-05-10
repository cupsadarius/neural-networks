const phrase = 'I wanna be the very best, like no one ever was. To catch them is my real test, to train them is my cause...';

class Guesser extends Agent {
  constructor(dna) {
    super(dna || Array(phrase.length).fill(randomInt(0, 255)));
  }

  evaluate(context) {
    for (let index in this.dna) {
      if (String.fromCharCode(this.dna[index]) === context.data[index]) {
        this.score += 1;
      }
    }

    this.die();
  }

  mutate(mutationRate) {
    for (let index in this.dna) {
      if (gaussianRandom() < mutationRate) {
        this.dna[index] = randomInt(0,255);
      }
    }

    return this;
  }

  static crossover(a, b, crossoverRate) {
    let dna = a.dna.slice();
    dna = dna.map((gene, i) => {
      return Math.random() < crossoverRate ? b.dna[i] : gene;
    });

    return new Guesser(dna).setDeathHandler(a.onDeath);
  }
}

const p = new Population(Guesser, {data: phrase}, 500, 0.5, 0.01)

while (true) {
  p.nextGeneration();
  console.log(p.bestOverall.dna.map(e => String.fromCharCode(e)).join(''));
  if (p.bestOverall.score === phrase.length) {
    break;
  }
}

console.log(p.bestOverall);