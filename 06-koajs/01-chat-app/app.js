const path = require('path');
const Koa = require('koa');
// const Message = require('./message');

const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

const promises = [];

router.get('/subscribe', async (ctx, next) => {
  ctx.set('Content-type', 'text/plain;charset=utf-8');
  ctx.status = 200;
  ctx.body = await new Promise((resolve) => {
    promises.push(resolve);
  });

  return next();
});

router.post('/publish', async (ctx, next) => {
  // const message = new Message(ctx.request.body.message);
  const message = ctx.request.body.message;

  if (message) {
    while (promises.length) {
      const resolve = promises.pop();

      resolve(message);
    }
  }

  ctx.status = 201;
  return next();
});

app.use(router.routes());

module.exports = app;
