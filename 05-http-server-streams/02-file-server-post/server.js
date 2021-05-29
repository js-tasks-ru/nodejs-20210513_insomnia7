const http = require('http');
const path = require('path');
const { createWriteStream, unlink } = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end('No nested files');
        return;
      }

      const writeStream = createWriteStream(filepath, { flags: 'wx' });
      const transformStream = new LimitSizeStream({
        limit: 1000000,
        readableObjectMode: false,
      });

      req.on('aborted', () => {
        unlink(filepath, () => {
          res.statusCode = 500;
          res.end('Client aborted connection');
        });
      });

      writeStream.on('error', (e) => {
        switch (e.code) {
          case 'EEXIST':
            res.statusCode = 409;
            res.end('Already exist');
            break;
        }
      });

      transformStream.on('error', (e) => {
        if (e.code === 'LIMIT_EXCEEDED') {
          unlink(filepath, () => {
            res.statusCode = 413;
            res.end('File size limit reached');
          });
        }
      });

      req.pipe(transformStream).pipe(writeStream);

      writeStream.on('close', () => {
        res.statusCode = 201;
        res.end();
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
