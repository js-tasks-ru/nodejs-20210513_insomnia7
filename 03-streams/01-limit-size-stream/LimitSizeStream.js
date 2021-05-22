const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor({ limit, ...options }) {
    super(options);
    this.limit = limit;
    this.currentLength = 0;
  }

  _transform(chunk, encoding, callback) {
    try {
      this.currentLength += chunk.length;

      if (this.currentLength > this.limit) {
        throw new LimitExceededError();
      }

      callback(null, chunk);
    } catch (e) {
      callback(e);
    }
  }
}

module.exports = LimitSizeStream;
