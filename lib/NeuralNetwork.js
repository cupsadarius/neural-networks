if (typeof module !== 'undefined') {
  const activation = require('./activation');
  const { randomFrom } = require('./utils');
}

class NeuralNetwork {
  
  constructor(nodes) {
    this.nodes = nodes;

    this.weights = [];

    for (let i = 1; i < this.nodes.length; i++) {
      this.weights[i - 1] = new Matrix(this.nodes[i], this.nodes[i - 1]);
      this.weights[i - 1].randomize(); 
    }

    this.bias = [];

    for (let i = 1; i < this.nodes.length; i++) {
      this.bias[i - 1] = new Matrix(this.nodes[i], 1);
      this.bias[i - 1].randomize();
    }
    this.activationMap = [];
    this.activation = [];
    for (let i = 1; i < this.nodes.length; i++) {
      this.activation[i - 1] = [];
      this.activationMap[i - 1] = [];
      for (let j = 0; j < this.nodes[i]; j++) {
        this.activation[i - 1][j] = randomFrom(activation);
        this.activationMap[i - 1][j] = this.activation[i - 1][j].toString();
      }
    }


    this.setLearningRate();
  }

  setLearningRate(learning_rate = 0.1) {
    this.learning_rate = learning_rate;
    return this;
  }

  setActivationFunction(func, fromMap = false) {
    if (!fromMap) {
      if (func instanceof Array) {
        this.activation = func;
      } else {
        this.activation = [];
        for (let i = 1; i < this.nodes.length; i++) {
          this.activation[i - 1] = [];
          for (let j = 0; j < this.nodes[i]; j++) {
            this.activation[i - 1][j] = func;
          }
        }
      }
      this.activationMap = [];
      for (let i = 0; i < this.activation.length; i++) {
        this.activationMap[i] = [];
        for (let j = 0; j < this.activation[i].length; j++) {
          this.activationMap[i][j] = this.activation[i][j].toString();
        }
      }
    } else if (func instanceof Array) {
      this.activation = [];
      for (let i = 0; i < func.length; i++) {
        this.activation[i] = [];
        for (let j = 0; j < func[i].length; j++) {
          this.activation[i][j] = activation[func[i][j]];
        }
      }

      this.activationMap = func;
    }

    return this;
  }


  copy() {
    return NeuralNetwork.fromNeuralNetwork(this);
  }

  train(input_array, target_array) {
    const inputs = Matrix.fromArray(input_array);

    // propagate training input through the network
    let hidden = this.feedForward(input_array);

    let targets = Matrix.fromArray(target_array);

    // calculate errors
    let errors = Array(hidden.length);

    for (let i = hidden.length - 1; i >= 0; i --) {
      if (i === hidden.length - 1) {
        errors[i] = Matrix.subtract(targets, hidden[hidden.length - 1]);
      } else {
        errors[i] = Matrix.multiply(
          Matrix.transpose(this.weights[i + 1]),
          errors[i + 1]
        );
      }
    }

    // calculate gradients
    const gradients = Array(hidden.length);
    for (let i = hidden.length - 1; i >= 0; i--) {
      gradients[i] = Matrix.map(hidden[i], (e, index) => this.activation[i][index](e, true))
        .multiply(this.learning_rate)
        .multiply(errors[i]);
    }

    // calculate deltas
    const deltas = Array(hidden.length);
    for (let i = hidden.length - 1; i >= 0; i--) {
      deltas[i] = Matrix.multiply(
        gradients[i],
        Matrix.transpose(i === 0 ? inputs : hidden[i - 1])
      );
    }

    // adjust weights
    for (let i = 0; i < deltas.length; i++) {
      this.weights[i].add(deltas[i]);
    }

    // adjust bias
    for (let i = 0; i < this.bias.length; i++) {
      this.bias[i].add(gradients[i]);
    }
  }

  feedForward(input_array) {
    const inputs = Matrix.fromArray(input_array);

    let hidden = [];
    for (let i = 0; i < this.weights.length; i++) {
      hidden[i] = Matrix
        .multiply(this.weights[i], i === 0 ? inputs : hidden[i - 1])
        .add(this.bias[i])
        .map((e, index) => this.activation[i][index](e, false));
    }

    return hidden;
  }

  predict(input_array) {
    const output = this.feedForward(input_array).pop();
    return output.toArray();
  }

  // Accept an arbitrary function for mutation
  mutate(mutator) {
    this.weights.map(matrix => matrix.map(mutator));
    this.bias.map(matrix => matrix.map(mutator));
  }

  serialize() {
    return JSON.stringify(this);
  }

  static deserialize(data) {
    if (typeof data == 'string') {
      data = JSON.parse(data);
    }
    let nn = new NeuralNetwork(data.nodes);

    nn.weights = data.weights.map(weights => Matrix.deserialize(weights));
    nn.bias = data.bias.map(bias => Matrix.deserialize(bias));
    
    nn.setLearningRate(data.learning_rate);
    nn.setActivationFunction(data.activationMap, true);

    return nn;
  }

  static fromNeuralNetwork(network) {
    let output = new NeuralNetwork(network.nodes);

    output.weights = network.weights.map(weight => weight.copy());
    output.bias = network.bias.map(bias => bias.copy());

    output.setLearningRate(network.learning_rate);
    output.setActivationFunction(network.activationMap, true);

    return output;
  }

};

if (typeof module !== 'undefined') {
  module.exports = NeuralNetwork;
}