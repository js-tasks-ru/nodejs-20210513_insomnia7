const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      if (!pathname) {
        res.statusCode = 400;
        return res.end('No file on empty request');
      }

      if (pathname.includes('/')) {
        res.statusCode = 400;
        return res.end('No nested files');
      }

      const readStream = fs.createReadStream(filepath);

      readStream.on('error', (e) => {
        readStream.destroy();

        if (e.code === 'ENOENT') {
          res.statusCode = 404;
          return res.end('Not found');
        }

        res.statusCode = 500;
        return res.end('Internal server error');
      });

      readStream.pipe(res);
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
