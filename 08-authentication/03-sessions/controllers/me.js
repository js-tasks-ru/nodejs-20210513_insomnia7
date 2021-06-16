module.exports.me = async function me(ctx, next) {
  if (!ctx.user) {
    ctx.status = 401
    ctx.body = {error: 'Пользователь не залогинен'}

    return
  }

  ctx.body = {
    email: ctx.user.email,
    displayName: ctx.user.displayName,
  };

  next();
};
