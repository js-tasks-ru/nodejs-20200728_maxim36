const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    const {limit, encoding, ...other} = options;
    super(other);
    this._limit= limit || 2 ** 15;
    this._flowedBytes = 0;
    this.setEncoding(encoding);
  }

  _transform(chunk, encoding, callback) {
    const {_flowedBytes, _limit} = this;
    const chunkLength = chunk.length;
    const totalLength = _flowedBytes + chunkLength;

    if (_limit < totalLength) {
      callback(new LimitExceededError());
    } else {
      this._flowedBytes += chunkLength;
      callback(null, chunk);
    }
  }
}

module.exports = LimitSizeStream;
