class Guesser extends Agent {
  constructor(dna) {
    super(dna || Array(phrase.length).fill(randomInt(0, 255)));
  }

  evaluate({data}) {
    for (let index in this.dna) {
      if (String.fromCharCode(this.dna[index]) === data[index]) {
        this.score += 1;
      }
    }

    this.die();
  }

  mutate({rate}) {
    for (let index in this.dna) {
      if (gaussianRandom() < rate) {
        this.dna[index] = randomInt(0,255);
      }
    }

    return this;
  }

  static crossover(a, b, {rate}) {
    let dna = a.dna.slice();
    dna = dna.map((gene, i) => {
      return Math.random() < rate ? b.dna[i] : gene;
    });

    return new Guesser(dna).setDeathHandler(a.onDeath);
  }
}
