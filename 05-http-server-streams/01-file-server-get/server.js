const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const handlers = {
  async GET(res, filepath) {
    const fileStream = fs.createReadStream(filepath, {encoding: 'utf8'});
    fileStream.pipe(res).on('error', (err) => {
      res.statusCode = 500;
      res.end('Server error');
    });

    fileStream.on('error', (error) => {
      if (error.code === 'ENOENT') {
        res.statusCode = 404;
        res.end('Not fuond');
      } else {
        res.statusCode = 500;
        res.end('Server error');
      }
    })
  }
}


const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  if (pathname.indexOf('/') !== -1) {
    res.statusCode = 400;
    res.end('Bad request');
    return;
  };

  const filepath = path.join(__dirname, 'files', pathname);

  const handler = handlers[req.method];
  if (handler) {
    handler(res, filepath);
  } else {
    res.statusCode = 501;
    res.end('Not implemented');
  }
});

module.exports = server;
