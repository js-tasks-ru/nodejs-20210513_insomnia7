const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);

    this._lastLine = '';
  }

  _transform(chunk, encoding, callback) {
    let string = this._lastLine + chunk.toString();

    while (true) {
      const index = string.indexOf(os.EOL);

      if (index === -1) {
        this._lastLine = string;
        break;
      }

      this.push(string.slice(0, index));
      string = string.substr(index + 1);
    }

    callback();
  }

  _flush(callback) {
    if (this._lastLine) {
      this.push(this._lastLine);
    }
    this._lastLine = null;
    callback();
  }
}

module.exports = LineSplitStream;
