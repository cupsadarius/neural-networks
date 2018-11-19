class Guesser extends Agent {
  constructor(dna) {
    super(dna || Array(phrase.length).fill(0).map(() => randomInt(0, 255)));
    this.species = 'guesser';
  }

  evaluate({data}) {
    for (let index in this.dna) {
      this.score += String.fromCharCode(this.dna[index]) === data[index] ? 1 :  0;     
    }

    this.die();
  }

  mutate({rate}) {
    for (let index in this.dna) {
      if (Math.random() < rate) {
        this.dna[index] = randomInt(0, 255);
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
