const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    const {encoding, other} = options;
    super(other);
    this._buffer = '';
    this.setEncoding(encoding);
  }

  _transform(chunk, encoding, callback) {
    chunk.toString().split(os.EOL).forEach((item, i, arr) => {
      if (arr.length === 1) {
        this._buffer += item;
        return;
      };
      if (i === 0) {
        this.push(this._buffer.concat(item));
        this._buffer = '';
        return;
      };
      if (i === arr.length - 1) {
        this._buffer = item;
        return;
      }
      this.push(item);
    });
    callback();
  }

  _flush(callback) {
    callback(null, this._buffer);
  }
}

module.exports = LineSplitStream;
