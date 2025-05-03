class Translation {
  constructor(type, input, output) {
    this.id = Date.now().toString();
    this.type = type; // 'audio' or 'gesture'
    this.input = input;
    this.output = output;
    this.timestamp = new Date();
    this.status = "completed";
  }

  toJSON() {
    return {
      id: this.id,
      type: this.type,
      output: this.output,
      timestamp: this.timestamp,
      status: this.status,
    };
  }
}

export default Translation;
