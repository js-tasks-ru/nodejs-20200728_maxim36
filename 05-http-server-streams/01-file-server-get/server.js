const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const hasFile = (filepath) => {
  return new Promise((resolve) => {
    fs.access(filepath, (err) => {
      console.log(err);
      if (err) resolve(false);
      else resolve(true);
    })
  })
}

const handlers = {
  async GET(res, filepath) {
    const fileExist = await hasFile(filepath);
    if (!fileExist) {
      res.statusCode = 404;
      res.end('Not fuond');
      return;
    };
    const fileStream = fs.createReadStream(filepath, {encoding: 'utf8'});
    fileStream.pipe(res).on('error', (err) => {
      res.statusCode = 500;
      res.end('Server error');
    });
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
