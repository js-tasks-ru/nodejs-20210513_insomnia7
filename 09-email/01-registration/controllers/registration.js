const { v4: uuid } = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const { email, displayName, password } = ctx.request.body;

  const verificationToken = uuid();

  const user = new User({ displayName, email, verificationToken });

  await user.setPassword(password);
  await user.save();

  try {
    await sendMail({
      template: 'confirmation',
      to: email,
      subject: 'NodeJS test app. Approve your email.',
      locals: { token: verificationToken },
    });
  } catch (e) {
    console.log('Unable to send e-mail');
    console.log(e);
    ctx.throw(400, 'Unable to send e-mail');
  }

  ctx.status = 200;
  ctx.body = { status: 'ok' };
  next();
};

module.exports.confirm = async (ctx, next) => {
  const { verificationToken } = ctx.request.body;
  const throwError = () => {
    ctx.status = 400;
    ctx.body = {
      error: 'Ссылка подтверждения недействительна или устарела',
    };
  };

  if (!verificationToken) {
    return throwError();
  }

  let user;

  try {
    user = await User.findOne({ verificationToken });
  } catch (e) {
    return throwError();
  }

  if (!user) {
    return throwError();
  }

  user.verificationToken = undefined;

  await user.save();

  const token = await ctx.login(user);

  ctx.body = { token };
};
