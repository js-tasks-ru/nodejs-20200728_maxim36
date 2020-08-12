const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

const hasFile = (filepath) => {
  return new Promise((resolve) => {
    fs.access(filepath, (err) => {
      if (err) resolve(false);
      else resolve(true);
    })
  })
}

const handlers = {
  async DELETE(req, res, filepath) {
    const fileExist = await hasFile(filepath);
    if (!fileExist) {
      res.statusCode = 404;
      res.end('Not found');
      return;
    };
    fs.unlink(filepath, (err) => {
      if (err) {
        res.statusCode = 500;
        res.end();
        return;
      }
      res.statusCode = 200;
      res.end();
    })
  }
}

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  if (pathname.indexOf('/') !== -1) {
    res.statusCode = 400;
    res.end('Bad request');
    return;
  };

  const filepath = path.join(__dirname, 'files', pathname).replace(/`path.delimetr`/g, '/');

  const handler = handlers[req.method];
  if (handler) {
    handler(req, res, filepath);
  } else {
    res.statusCode = 501;
    res.end('Not implemented');
  }
})


module.exports = server;
