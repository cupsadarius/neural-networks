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

    this.setLearningRate();
    this.setActivationFunction(sigmoid);
  }

  setLearningRate(learning_rate = 0.1) {
    this.learning_rate = learning_rate;
  }

  setActivationFunction(func = sigmoid) {
    this.activation_function = func;
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
    errors[hidden.length - 1] = Matrix.subtract(targets, hidden[hidden.length - 1]);

    for (let i = hidden.length - 2; i >= 0; i --) {
      errors[i] = Matrix.multiply(
        Matrix.transpose(this.weights[i + 1]),
        errors[i + 1]
      );
    }

    // calculate gradients
    const gradients = Array(hidden.length);
    for (let i = hidden.length - 1; i >= 0; i--) {
      gradients[i] = Matrix.map(hidden[i], this.activation_function.dfunc)
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
        .map(this.activation_function.func);
    }

    return hidden;
  }

  predict(input_array) {
    const output = this.feedForward(input_array).pop();
    
    return output.toArray();
  }

  // Accept an arbitrary function for mutation
  mutate(func) {
    this.weights_ih.map(func);
    this.weights_ho.map(func);
    this.bias_h.map(func);
    this.bias_o.map(func);
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

    nn.learning_rate = data.learning_rate;

    return nn;
  }

  static fromNeuralNetwork(network) {
    let output = new NeuralNetwork(network.nodes);

    output.weights = network.weights.map(weight => weight.copy());
    output.bias = network.bias.map(bias => bias.copy());

    output.setLearningRate(network.learning_rate);
    output.setActivationFunction(network.activation_function);

    return output;
  }

}