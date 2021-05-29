const http = require('http');
const path = require('path');
const { unlink } = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':
      if (!pathname) {
        res.statusCode = 400;
        res.end('Should be name of file in request');
      }

      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end('No nested files');
      }

      unlink(filepath, (err) => {
        if (err) {
          res.statusCode = 404;
          res.end('Not found');
        }

        res.statusCode = 200;
        res.end(`${pathname} has been deleted`);
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
